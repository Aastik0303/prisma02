import { FastifyInstance } from 'fastify';
import { contactRequestRateLimit } from '../../plugins/rateLimit.js';
import { sendContactRequestEmail } from '../../utils/email.js';
import { contactRequestSchema } from './contact.schema.js';

export async function contactRoutes(fastify: FastifyInstance) {
  fastify.post('/request', {
    config: { rateLimit: contactRequestRateLimit }
  }, async (request, reply) => {
    if (!fastify.config.ADMIN_EMAIL) {
      return reply.status(503).send({
        statusCode: 503,
        error: 'Service Unavailable',
        code: 'EMAIL_NOT_CONFIGURED',
        message: 'Contact email delivery is not configured.'
      });
    }

    const body = contactRequestSchema.parse(request.body);
    if (body.website) {
      return reply.status(202).send({ message: 'Request received.' });
    }

    await sendContactRequestEmail({
      name: body.name,
      email: body.email,
      message: body.message,
      ip: request.ip,
      receivedAt: new Date().toISOString()
    });

    await fastify.prisma.auditLog.create({
      data: {
        action: 'contact.request.submitted',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: { senderEmail: body.email, senderName: body.name }
      }
    });

    return reply.status(202).send({
      message: 'Your message has been sent. We will get back to you soon.'
    });
  });
}
