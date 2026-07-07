import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRole } from '@prisma/client';
import { errors as joseErrors } from 'jose';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      fullName: string;
    };
  }
}

/**
 * Middleware to require a valid Bearer JWT access token.
 * Also checks if the token's unique ID (jti) is blacklisted in Redis.
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message: 'Access token is missing or invalid'
      });
    }

    const token = authHeader.substring(7);
    const payload = await request.server.jwtService.verifyAccessToken(token);

    // Check if JTI is blacklisted in Redis (indicating a logged-out token)
    const blacklistKey = `blacklist:jti:${payload.jti}`;
    const isBlacklisted = await request.server.redis.exists(blacklistKey);

    if (isBlacklisted) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message: 'Access token has been revoked'
      });
    }

    // Look up the user to ensure they still exist and are active
    const user = await request.server.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        lockedUntil: true
      }
    });

    if (!user) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message: 'User session no longer exists'
      });
    }

    // Verify account is not locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'ACCOUNT_LOCKED',
        message: 'Account is currently locked'
      });
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };
  } catch (error: any) {
    const isExpired = error instanceof joseErrors.JWTExpired || error?.code === 'ERR_JWT_EXPIRED';
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      code: isExpired ? 'TOKEN_EXPIRED' : 'UNAUTHORIZED',
      message: isExpired
        ? 'Your session has expired. Please refresh your session or sign in again.'
        : 'Authentication failed'
    });
  }
}

/**
 * Middleware generator to enforce Role-Based Access Control (RBAC).
 * Returns a Fastify preHandler hook.
 */
export function requireRole(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // requireAuth must have run already
    if (!request.user) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource'
      });
    }
  };
}
