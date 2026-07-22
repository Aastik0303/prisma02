import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRole } from '@prisma/client';
import { errors as joseErrors } from 'jose';

const AUTH_CACHE_TTL_MS = 30_000;
const REVOCATION_CACHE_TTL_MS = 5_000;

type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  lockedUntil: Date | null;
};

const userCache = new Map<string, { value: AuthUser | null; expiresAt: number }>();
const userLookups = new Map<string, Promise<AuthUser | null>>();
const revocationCache = new Map<string, { value: boolean; expiresAt: number }>();
const revocationLookups = new Map<string, Promise<boolean>>();

async function cachedUser(request: FastifyRequest, userId: string) {
  const cached = userCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let lookup = userLookups.get(userId);
  if (!lookup) {
    lookup = request.server.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, fullName: true, lockedUntil: true }
    });
    userLookups.set(userId, lookup);
  }

  try {
    const user = await lookup;
    userCache.set(userId, { value: user, expiresAt: Date.now() + AUTH_CACHE_TTL_MS });
    return user;
  } finally {
    userLookups.delete(userId);
  }
}

async function cachedRevocation(request: FastifyRequest, jti: string) {
  const cached = revocationCache.get(jti);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let lookup = revocationLookups.get(jti);
  if (!lookup) {
    lookup = request.server.redis.exists(`blacklist:jti:${jti}`).then(Boolean);
    revocationLookups.set(jti, lookup);
  }

  try {
    const revoked = await lookup;
    revocationCache.set(jti, { value: revoked, expiresAt: Date.now() + REVOCATION_CACHE_TTL_MS });
    return revoked;
  } finally {
    revocationLookups.delete(jti);
  }
}

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
    const jti = String(payload.jti || '');
    const isBlacklisted = await cachedRevocation(request, jti);

    if (isBlacklisted) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message: 'Access token has been revoked'
      });
    }

    // Look up the user to ensure they still exist and are active
    const user = await cachedUser(request, String(payload.sub || ''));

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
