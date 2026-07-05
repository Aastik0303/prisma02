import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import oauthPlugin from '@fastify/oauth2';
import websocket from '@fastify/websocket';
import { ZodError } from 'zod';

import { config } from './config/config.js';
import dbPlugin from './plugins/db.js';
import redisPlugin from './plugins/redis.js';
import jwtPlugin from './plugins/jwt.js';
import rateLimitPlugin from './plugins/rateLimit.js';
import csrfPlugin from './plugins/csrf.js';

import { authRoutes } from './modules/auth/auth.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { teamsRoutes } from './modules/teams/teams.routes.js';
import { projectsRoutes } from './modules/projects/projects.routes.js';
import { tasksRoutes } from './modules/tasks/tasks.routes.js';
import { chatRoutes } from './modules/chat/chat.routes.js';
import { contactRoutes } from './modules/contact/contact.routes.js';
import { resumeRoutes } from './modules/resume/resume.routes.js';
import { catalogRoutes } from './modules/catalog/catalog.routes.js';
import { AuthService } from './modules/auth/auth.service.js';
import { ensureAdminUser } from './utils/adminBootstrap.js';

declare module 'fastify' {
  interface FastifyInstance {
    config: typeof config;
    authService: AuthService;
  }
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export async function buildApp(opts = {}) {
  const app = fastify({
    logger: config.NODE_ENV !== 'test',
    requestIdHeader: 'x-request-id',
    ...opts
  });

  // 1. Decorate app with validated config
  app.decorate('config', config);

  // 2. Register Helmet with strict security headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  });

  // 3. Register cookie support and CORS with explicit origin constraints
  await app.register(cookie);

  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) {
        cb(null, true);
        return;
      }

      const isAllowed = config.ALLOWED_ORIGINS.some(allowedOrigin => {
        return origin === allowedOrigin || origin.startsWith(allowedOrigin);
      });

      const isLocalDevOrigin = /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

      if (isAllowed || isLocalDevOrigin || config.NODE_ENV === 'test') {
        cb(null, true);
      } else {
        cb(new AppError(403, 'CORS_ERROR', 'Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
  });

  // 4. Register base plugins (DB, Redis, JWT, WebSockets)
  await app.register(dbPlugin);
  await app.register(redisPlugin);
  await app.register(jwtPlugin);
  await app.register(websocket);

  // 5. Decorate with AuthService (injecting db and redis)
  const authService = new AuthService(app.prisma, app.redis);
  app.decorate('authService', authService);

  if (config.NODE_ENV !== 'test') {
    await ensureAdminUser(app.prisma, {
      nodeEnv: config.NODE_ENV,
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
      fullName: config.ADMIN_FULL_NAME
    });
  }

  // 6. Register CSRF and Rate Limiting
  await app.register(csrfPlugin);
  await app.register(rateLimitPlugin);

  // 7. Register @fastify/oauth2 Plugins for Google and GitHub
  // Use dummy credentials if not present to allow booting in offline environments
  const googleClientId = config.GOOGLE_CLIENT_ID || 'dummy-google-client-id';
  const googleClientSecret = config.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret';
  await app.register(oauthPlugin, {
    name: 'googleOAuth2',
    credentials: {
      client: { id: googleClientId, secret: googleClientSecret },
      auth: (oauthPlugin as any).GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/api/v1/auth/oauth/google',
    callbackUri: 'http://localhost:3001/api/v1/auth/oauth/google/callback'
  });

  const githubClientId = config.GITHUB_CLIENT_ID || 'dummy-github-client-id';
  const githubClientSecret = config.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret';
  await app.register(oauthPlugin, {
    name: 'githubOAuth2',
    credentials: {
      client: { id: githubClientId, secret: githubClientSecret },
      auth: (oauthPlugin as any).GITHUB_CONFIGURATION
    },
    startRedirectPath: '/api/v1/auth/oauth/github',
    callbackUri: 'http://localhost:3001/api/v1/auth/oauth/github/callback'
  });

  // 8. Register root health route and API modules
  app.get('/', async (_request, reply) => {
    return reply.code(200).send({
      status: 'ok',
      service: 'prisma-embedded-codes-backend',
      message: 'Backend API is running.',
      docs: '/api/v1/auth/csrf-token'
    });
  });

  // 9. Global Error Handler
  app.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    const requestId = request.id;

    // Log the error (excluding sensitive information)
    if (error.statusCode && error.statusCode < 500) {
      request.log.info({ err: error, requestId }, `Client Error: ${error.message}`);
    } else {
      request.log.error({ err: error, requestId }, `Internal Server Error: ${error.message}`);
    }

    // A. Zod Validation Errors
    if (error instanceof ZodError || error?.name === 'ZodError' || Array.isArray(error?.issues)) {
      const details = typeof error.format === 'function'
        ? error.format()
        : { issues: error.issues || [] };
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'VALIDATION_ERROR',
        message: error.issues?.[0]?.message || 'Input validation failed',
        details,
        requestId
      });
    }

    // B. Custom Application Errors
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
        code: error.code,
        message: error.message,
        details: error.details,
        requestId
      });
    }

    // Services may throw lightweight structured errors.
    if (error?.statusCode && error?.code && !String(error.code).startsWith('FST_')) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.statusCode >= 500 ? 'Internal Server Error' : 'Request Error',
        code: error.code,
        message: error.message,
        details: error.details,
        requestId
      });
    }

    // C. Fastify Rate Limit Error
    if (error.statusCode === 429) {
      return reply.status(429).send({
        statusCode: 429,
        error: 'Too Many Requests',
        code: (error as any).code || 'RATE_LIMITED',
        message: error.message,
        details: (error as any).details,
        requestId
      });
    }

    // D. Prisma Database Errors
    if (error.name?.startsWith('PrismaClient')) {
      const isProduction = config.NODE_ENV === 'production';
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'DATABASE_ERROR',
        message: isProduction ? 'A database operation error occurred' : error.message,
        requestId
      });
    }

    // E. General Fallback Server Errors
    const statusCode = error.statusCode || 500;
    const isDev = config.NODE_ENV === 'development';

    return reply.status(statusCode).send({
      statusCode,
      error: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
      message: isDev ? error.message : 'An unexpected error occurred. Please contact support.',
      ...(isDev && { stack: error.stack }),
      requestId
    });
  });

  // 10. Register API modules after the error handler so plugin routes inherit it.
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(usersRoutes, { prefix: '/api/v1/users' });
  await app.register(teamsRoutes, { prefix: '/api/v1/teams' });
  await app.register(projectsRoutes, { prefix: '/api/v1/projects' });
  await app.register(tasksRoutes, { prefix: '/api/v1/tasks' });
  await app.register(chatRoutes, { prefix: '/api/v1/chat' });
  await app.register(contactRoutes, { prefix: '/api/v1/contact' });
  await app.register(resumeRoutes, { prefix: '/api/resume' });
  await app.register(catalogRoutes, { prefix: '/api/v1/catalog' });

  return app;
}
