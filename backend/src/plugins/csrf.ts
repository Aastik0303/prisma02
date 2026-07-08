import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    csrfSessionId: string;
  }
}

// Utility to parse cookies manually to avoid dependency complexities
export function getCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const getHeaderValue = (value: string | string[] | undefined): string | null => {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
};

const csrfPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Extract or establish the CSRF session ID before validation hooks run.
  fastify.addHook('onRequest', async (request: FastifyRequest, _reply: FastifyReply) => {
    let sessionId = getCookie(request.headers.cookie, 'csrf_session_id')
      || getHeaderValue(request.headers['x-csrf-session-id']);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      // Attach to request context
      request.csrfSessionId = sessionId;
      // We will set the cookie when replying (if it is a response that sets CSRF token, or global hook)
    } else {
      request.csrfSessionId = sessionId;
    }
  });

  // Verification hook for mutating methods (POST, PUT, PATCH, DELETE)
  fastify.addHook('preValidation', async (request: FastifyRequest, reply: FastifyReply) => {
    // Only validate for state-mutating requests
    const method = request.method;
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return;
    }

    // Allow bypassing CSRF check for testing if needed, or specific bypasses
    // e.g. OAuth callback might come as POST from a third party provider,
    // but in our spec, OAuth callback is GET, which is safe.
    // Also ignore CSRF check in testing if we explicitly set header/flag, but standard is to enforce.
    
    // Extract CSRF token from header
    const csrfToken = request.headers['x-csrf-token'];
    if (!csrfToken || typeof csrfToken !== 'string') {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'INVALID_CSRF_TOKEN',
        message: 'CSRF token is missing'
      });
    }

    const sessionId = request.csrfSessionId;
    if (!sessionId) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'INVALID_CSRF_TOKEN',
        message: 'CSRF session not found'
      });
    }

    const tokenKey = `csrf:${sessionId}:${csrfToken}`;
    const legacySessionKey = `csrf:${sessionId}`;
    const [storedToken, legacyStoredToken] = await Promise.all([
      fastify.redis.get(tokenKey),
      fastify.redis.get(legacySessionKey)
    ]);

    if (!storedToken && legacyStoredToken !== csrfToken) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'INVALID_CSRF_TOKEN',
        message: 'CSRF token is invalid or has expired'
      });
    }
  });
};

export default fp(csrfPlugin, { name: 'csrf-plugin' });
