import { FastifyInstance, FastifyRequest } from 'fastify';
import { ChatService } from './chat.service.js';
import { requireAuth } from '../auth/auth.middleware.js';
import { RawServerDefault } from 'fastify';
import { WebSocket } from 'ws';
import { learningChatAiRateLimit } from '../../plugins/rateLimit.js';
import { aiChatBodySchema, answerLearningChat } from './chat.ai.js';
import { copilotRagBodySchema, answerCopilotWithRag } from './copilot.rag.js';

// Global map to track active WebSocket connections by user ID
const activeClients = new Map<string, WebSocket>();

export async function chatRoutes(fastify: FastifyInstance) {
  const chatService = new ChatService(fastify.prisma);

  // Standard API for message history
  fastify.get('/messages', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const userId = request.user!.id;
    const { teamId, projectId, receiverId } = request.query as {
      teamId?: string;
      projectId?: string;
      receiverId?: string;
    };

    const messages = await chatService.getMessages({
      teamId,
      projectId,
      userId,
      receiverId
    });

    return reply.status(200).send(messages);
  });

  fastify.post('/messages', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { receiverId, content } = request.body as { receiverId?: string; content?: string };
    const clean = String(content || '').trim();
    if (!receiverId || !clean || clean.length > 1200) {
      return reply.status(400).send({ message: 'A recipient and a message of up to 1200 characters are required.' });
    }
    if (receiverId === request.user!.id) return reply.status(400).send({ message: 'You cannot message yourself.' });
    const receiver = await fastify.prisma.user.findUnique({ where: { id: receiverId }, select: { id: true } });
    if (!receiver) return reply.status(404).send({ message: 'Recipient not found.' });

    const saved = await chatService.saveMessage({ senderId: request.user!.id, receiverId, content: clean });
    const receiverSocket = activeClients.get(receiverId);
    if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
      receiverSocket.send(JSON.stringify({ type: 'message', message: saved }));
    }
    return reply.status(201).send(saved);
  });

  fastify.post('/ai', {
    preHandler: [requireAuth],
    config: { rateLimit: learningChatAiRateLimit }
  }, async (request, reply) => {
    const body = aiChatBodySchema.parse(request.body);
    const result = await answerLearningChat(body);

    return reply.status(200).send({
      answer: result.answer,
      model: fastify.config.GROQ_MODEL
    });
  });

  fastify.post('/copilot-rag', {
    preHandler: [requireAuth],
    config: { rateLimit: learningChatAiRateLimit }
  }, async (request, reply) => {
    const body = copilotRagBodySchema.parse(request.body);
    const result = await answerCopilotWithRag(body);

    return reply.status(200).send({
      answer: result.answer,
      sources: result.sources,
      model: fastify.config.GROQ_MODEL,
      embeddingModel: fastify.config.HUGGINGFACE_EMBEDDING_MODEL
    });
  });

  // WebSocket Route
  fastify.get('/ws', { websocket: true }, async (socket, req: FastifyRequest) => {
    let userId: string | null = null;
    let userEmail: string | null = null;
    let userRole: string | null = null;
    let userFullName: string | null = null;

    try {
      // 1. Authenticate via token in query parameters
      const { token } = req.query as { token?: string };
      if (!token) {
        socket.close(4001, 'Authentication token missing');
        return;
      }

      const payload = await fastify.jwtService.verifyAccessToken(token);
      userId = payload.sub;

      // Fetch user details
      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, fullName: true }
      });

      if (!user) {
        socket.close(4002, 'User session not found');
        return;
      }

      userEmail = user.email;
      userRole = user.role;
      userFullName = user.fullName;

      // Register connection
      activeClients.set(userId, socket);
      fastify.log.info(`🔌 WebSocket connected for user ${userFullName} (${userId})`);

      // Send connection acknowledgement
      socket.send(JSON.stringify({
        type: 'auth_success',
        message: 'Authenticated successfully with WebSocket server'
      }));

    } catch (err: any) {
      fastify.log.error('❌ WebSocket Auth Error:', err.message);
      socket.close(4003, 'Authentication failed');
      return;
    }

    // 2. Handle incoming WebSocket messages
    socket.on('message', async (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        const { type, teamId, projectId, receiverId, content, isAnnouncement } = parsed;

        if (type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        if (type === 'message') {
          if (!content || content.trim() === '') return;

          // Permission check: ensure sender is team member if teamId or projectId is specified
          if (teamId) {
            const isMember = await fastify.prisma.teamMember.findUnique({
              where: {
                teamId_userId: {
                  teamId,
                  userId: userId!
                }
              }
            });
            if (!isMember && userRole !== 'admin' && userRole !== 'super_admin') {
              socket.send(JSON.stringify({
                type: 'error',
                message: 'You are not a member of this team'
              }));
              return;
            }
          }

          // Save message to database
          const savedMsg = await chatService.saveMessage({
            teamId,
            projectId,
            senderId: userId!,
            receiverId,
            content,
            isAnnouncement
          });

          // Construct message response
          const outPayload = JSON.stringify({
            type: 'message',
            message: savedMsg
          });

          // Dispatching / Broadcasting
          if (receiverId) {
            // A. Direct Message: send to sender and receiver
            const receiverSocket = activeClients.get(receiverId);
            if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
              receiverSocket.send(outPayload);
            }
            socket.send(outPayload);

          } else if (projectId) {
            // B. Project Chat: broadcast to all members of the project's team
            const project = await fastify.prisma.project.findUnique({
              where: { id: projectId },
              select: { teamId: true }
            });
            
            if (project?.teamId) {
              const members = await fastify.prisma.teamMember.findMany({
                where: { teamId: project.teamId },
                select: { userId: true }
              });

              for (const m of members) {
                const memberSocket = activeClients.get(m.userId);
                if (memberSocket && memberSocket.readyState === WebSocket.OPEN) {
                  memberSocket.send(outPayload);
                }
              }
            }

          } else if (teamId) {
            // C. Team Chat: broadcast to all team members
            const members = await fastify.prisma.teamMember.findMany({
              where: { teamId },
              select: { userId: true }
            });

            for (const m of members) {
              const memberSocket = activeClients.get(m.userId);
              if (memberSocket && memberSocket.readyState === WebSocket.OPEN) {
                memberSocket.send(outPayload);
              }
            }
          }
        }
      } catch (err: any) {
        fastify.log.error('❌ WebSocket message processing error:', err.message);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });

    // 3. Handle connection termination
    socket.on('close', () => {
      if (userId && activeClients.get(userId) === socket) {
        activeClients.delete(userId);
        fastify.log.info(`🔌 WebSocket disconnected for user ${userId}`);
      }
    });

    socket.on('error', (err: any) => {
      fastify.log.error(`⚠️ WebSocket Error for user ${userId}:`, err.message);
    });
  });
}

export default chatRoutes;
