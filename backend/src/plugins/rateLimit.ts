import rateLimit, { RateLimitOptions } from '@fastify/rate-limit';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const rateLimitPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Register rate limit plugin
  // We use the redis instance decorated in the previous step
  await fastify.register(rateLimit, {
    global: false, // Explicitly configure route-by-route rate limiting
    redis: fastify.config.NODE_ENV === 'production' ? fastify.redis : undefined, // Use in-memory limiter locally
    skipOnError: true, // Fail open if Redis is down (high-availability safeguard)
    errorResponseBuilder: (request, context) => {
      const rateContext = context as typeof context & {
        limit?: number;
        window?: string | number;
      };
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        code: 'RATE_LIMITED',
        message: `Too many requests, please try again after ${context.after}.`,
        details: {
          limit: rateContext.limit,
          window: rateContext.window,
          ttl: context.ttl
        }
      };
    }
  });
};

// Route-specific configurations
export const loginIpRateLimit: RateLimitOptions = {
  max: 10,
  timeWindow: 15 * 60 * 1000, // 15 minutes
  keyGenerator: (request) => `rl:login:ip:${request.ip}`
};

export const loginEmailRateLimit: RateLimitOptions = {
  max: 5,
  timeWindow: 15 * 60 * 1000, // 15 minutes
  keyGenerator: (request: any) => {
    const email = (request.body?.email || '').toLowerCase().trim();
    return `rl:login:email:${email}`;
  }
};

export const registerIpRateLimit: RateLimitOptions = {
  max: 3,
  timeWindow: 60 * 60 * 1000, // 1 hour
  keyGenerator: (request) => `rl:register:ip:${request.ip}`
};

export const forgotPasswordRateLimit: RateLimitOptions = {
  max: 3,
  timeWindow: 10 * 60 * 1000, // 10 minutes
  keyGenerator: (request: any) => {
    const email = (request.body?.email || '').toLowerCase().trim();
    return `rl:forgot:ip_email:${request.ip}:${email}`;
  }
};

export const verifyOtpRateLimit: RateLimitOptions = {
  max: 5,
  timeWindow: 5 * 60 * 1000, // 5 minutes
  keyGenerator: (request: any) => {
    const mfaToken = request.body?.mfaToken || '';
    return `rl:otp:${mfaToken}`;
  }
};

export const csrfTokenRateLimit: RateLimitOptions = {
  max: 30,
  timeWindow: 60 * 1000, // 1 minute
  keyGenerator: (request) => `rl:csrf:ip:${request.ip}`
};

export const contactRequestRateLimit: RateLimitOptions = {
  max: 5,
  timeWindow: 60 * 60 * 1000,
  keyGenerator: (request: any) => {
    const email = String(request.body?.email || '').toLowerCase().trim();
    return `rl:contact:${request.ip}:${email}`;
  }
};

export const resumeUploadRateLimit: RateLimitOptions = {
  max: 8,
  timeWindow: 15 * 60 * 1000,
  keyGenerator: request => `rl:resume:upload:${request.ip}`
};

export const resumeAiRateLimit: RateLimitOptions = {
  max: 20,
  timeWindow: 15 * 60 * 1000,
  keyGenerator: request => `rl:resume:ai:${request.ip}`
};

export const learningChatAiRateLimit: RateLimitOptions = {
  max: 30,
  timeWindow: 15 * 60 * 1000,
  keyGenerator: (request: any) => `rl:learning-chat:ai:${request.user?.id || request.ip}`
};

export default rateLimitPlugin;
