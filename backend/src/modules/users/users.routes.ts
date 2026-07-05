import { FastifyInstance } from 'fastify';
import { UsersService } from './users.service.js';
import { requireAuth, requireRole } from '../auth/auth.middleware.js';
import { verifyTotp } from '../auth/auth.service.js';
import crypto from 'crypto';

function generateBase32Secret(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return secret;
}

export async function usersRoutes(fastify: FastifyInstance) {
  const usersService = new UsersService(fastify.prisma);

  // GET /api/v1/users/me
  fastify.get('/me', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const user = await usersService.getUserById(request.user!.id);
    if (!user) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Profile not found'
      });
    }
    return user;
  });

  // PATCH /api/v1/users/me
  // Updates dashboard profile fields and local portfolio metadata for the signed-in user.
  fastify.patch('/me', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const body = request.body as {
      fullName?: string;
      avatarUrl?: string;
      metadata?: Record<string, any>;
    };

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : undefined;
    const updated = await usersService.updateUserProfile(request.user!.id, {
      fullName,
      avatarUrl: typeof body.avatarUrl === 'string' ? body.avatarUrl : undefined,
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {}
    });

    if (!updated) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Profile not found'
      });
    }

    return reply.status(200).send(updated);
  });

  // GET /api/v1/users/directory?query=aastik
  // Returns registered users that the signed-in student can discover and invite.
  fastify.get('/directory', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { query, limit } = request.query as { query?: string; limit?: string };
    const users = await usersService.searchRegisteredUsers({
      query,
      excludeUserId: request.user!.id,
      limit: limit ? Number(limit) : undefined
    });

    return reply.status(200).send(users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      emailVerified: user.emailVerified,
      metadata: user.metadata,
      createdAt: user.createdAt
    })));
  });

  // POST /api/v1/users/:id/collaboration-request
  // Stores the request as a direct chat message, so it is visible in the backend chat_messages table.
  fastify.post('/:id/collaboration-request', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { message, projectTitle } = request.body as { message?: string; projectTitle?: string };

    if (id === request.user!.id) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'SELF_COLLABORATION_REQUEST',
        message: 'You cannot send a collaboration request to yourself.'
      });
    }

    const targetUser = await fastify.prisma.user.findUnique({
      where: { id },
      select: { id: true, fullName: true, email: true }
    });

    if (!targetUser) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'USER_NOT_FOUND',
        message: 'Registered user not found.'
      });
    }

    const trimmedMessage = message?.trim();
    const collaborationMessage = [
      '[Collaboration Request]',
      projectTitle?.trim() ? `Project: ${projectTitle.trim()}` : null,
      trimmedMessage || 'I would like to collaborate with you on a learning project.'
    ].filter(Boolean).join('\n');

    const savedMessage = await fastify.prisma.chatMessage.create({
      data: {
        senderId: request.user!.id,
        receiverId: targetUser.id,
        content: collaborationMessage
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    await fastify.prisma.auditLog.create({
      data: {
        userId: request.user!.id,
        action: 'SEND_COLLABORATION_REQUEST',
        resource: `user:${targetUser.id}`,
        metadata: {
          targetUserId: targetUser.id,
          targetEmail: targetUser.email,
          projectTitle: projectTitle?.trim() || null,
          chatMessageId: savedMessage.id
        }
      }
    });

    return reply.status(201).send({
      success: true,
      message: savedMessage
    });
  });

  // GET /api/v1/users/admin/users
  fastify.get('/admin/users', {
    preHandler: [requireAuth, requireRole('admin', 'super_admin')]
  }, async (request, reply) => {
    const { query, limit } = request.query as { query?: string; limit?: string };
    const overview = await usersService.getAdminUsersOverview({
      query,
      limit: limit ? Number(limit) : undefined
    });
    return reply.status(200).send(overview);
  });

  // PATCH /api/v1/users/admin/users/:id/role
  fastify.patch('/admin/users/:id/role', {
    preHandler: [requireAuth, requireRole('admin', 'super_admin')]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { role } = request.body as { role: any };

    const targetUser = await fastify.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return reply.status(404).send({ message: 'User not found' });
    }

    if (request.user!.role !== 'super_admin') {
      if (role === 'super_admin' || targetUser.role === 'super_admin') {
        return reply.status(403).send({ message: 'Only super_admin can manage super_admin roles.' });
      }
    }

    const updated = await fastify.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    });

    await fastify.prisma.auditLog.create({
      data: {
        userId: request.user!.id,
        action: 'UPDATE_USER_ROLE',
        resource: `user:${id}`,
        metadata: { targetUserId: id, oldRole: targetUser.role, newRole: role }
      }
    });

    return updated;
  });

  // DELETE /api/v1/users/admin/users/:id
  fastify.delete('/admin/users/:id', {
    preHandler: [requireAuth, requireRole('admin', 'super_admin')]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const targetUser = await fastify.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return reply.status(404).send({ message: 'User not found' });
    }

    if (targetUser.role === 'super_admin' && request.user!.role !== 'super_admin') {
      return reply.status(403).send({ message: 'Cannot delete a super_admin user.' });
    }

    await fastify.prisma.user.delete({
      where: { id }
    });

    await fastify.prisma.auditLog.create({
      data: {
        userId: request.user!.id,
        action: 'DELETE_USER',
        resource: `user:${id}`,
        metadata: { targetUserId: id, targetEmail: targetUser.email }
      }
    });

    return { success: true };
  });

  // GET /api/v1/users/admin/audit-logs
  fastify.get('/admin/audit-logs', {
    preHandler: [requireAuth, requireRole('super_admin')]
  }, async (request, reply) => {
    const logs = await fastify.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return logs.map(log => ({
      ...log,
      id: log.id.toString()
    }));
  });

  // POST /api/v1/users/mfa/setup
  // Generate a new TOTP secret for the user
  fastify.post('/mfa/setup', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const userId = request.user!.id;
    const secret = generateBase32Secret();
    const email = request.user!.email;

    // Save temporary secret in Redis for 10 minutes
    await fastify.redis.set(`mfa-setup:${userId}`, secret, 'EX', 600);

    const qrCodeUrl = `otpauth://totp/PrismaEmbeddedCodes:${email}?secret=${secret}&issuer=PrismaEmbeddedCodes`;

    return reply.status(200).send({
      secret,
      qrCodeUrl
    });
  });

  // POST /api/v1/users/mfa/enable
  // Verify the OTP code and enable MFA
  fastify.post('/mfa/enable', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const userId = request.user!.id;
    const { code } = request.body as { code: string };

    if (!code) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'OTP Code is required'
      });
    }

    const secret = await fastify.redis.get(`mfa-setup:${userId}`);
    if (!secret) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'MFA setup session expired. Please request setup parameters again.'
      });
    }

    const isValid = verifyTotp(secret, code);
    if (!isValid) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid verification code. TOTP check failed.'
      });
    }

    // Delete setup session
    await fastify.redis.del(`mfa-setup:${userId}`);

    // Generate recovery codes
    const recoveryCodes = Array.from({ length: 5 }, () => crypto.randomBytes(4).toString('hex').toUpperCase());

    await fastify.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaSecret: secret,
        mfaRecoveryCodes: recoveryCodes
      }
    });

    return reply.status(200).send({
      success: true,
      recoveryCodes
    });
  });

  // POST /api/v1/users/mfa/disable
  // Disable MFA for the user
  fastify.post('/mfa/disable', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const userId = request.user!.id;

    await fastify.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaRecoveryCodes: []
      }
    });

    return reply.status(200).send({
      success: true
    });
  });
}

export default usersRoutes;
