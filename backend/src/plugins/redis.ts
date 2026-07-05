import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Redis } from 'ioredis';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis | MockRedis;
  }
}

// In-memory mock implementation for testing without live Redis
class MockRedis {
  private store = new Map<string, { value: string; expiry: number | null }>();

  private checkExpiry(key: string): boolean {
    const item = this.store.get(key);
    if (!item) return false;
    if (item.expiry && item.expiry < Date.now()) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  async get(key: string): Promise<string | null> {
    if (this.checkExpiry(key)) {
      return this.store.get(key)!.value;
    }
    return null;
  }

  async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
    let expiry: number | null = null;

    // Support "EX" option (seconds)
    const exIndex = args.indexOf('EX');
    if (exIndex !== -1 && args[exIndex + 1]) {
      expiry = Date.now() + Number(args[exIndex + 1]) * 1000;
    }

    // Support "PX" option (milliseconds)
    const pxIndex = args.indexOf('PX');
    if (pxIndex !== -1 && args[pxIndex + 1]) {
      expiry = Date.now() + Number(args[pxIndex + 1]);
    }

    this.store.set(key, { value: String(value), expiry });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const had = this.store.has(key);
    this.store.delete(key);
    return had ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const val = await this.get(key);
    const num = val ? Number(val) : 0;
    const newVal = num + 1;
    await this.set(key, String(newVal));
    return newVal;
  }

  async decr(key: string): Promise<number> {
    const val = await this.get(key);
    const num = val ? Number(val) : 0;
    const newVal = num - 1;
    await this.set(key, String(newVal));
    return newVal;
  }

  async exists(key: string): Promise<number> {
    return this.checkExpiry(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (item && this.checkExpiry(key)) {
      item.expiry = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }

  async quit(): Promise<'OK'> {
    return 'OK';
  }

  async disconnect(): Promise<void> {}
}

const redisPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  let redisClient: Redis | MockRedis;

  if (fastify.config.NODE_ENV === 'test' || fastify.config.NODE_ENV === 'development') {
    redisClient = new MockRedis();
    fastify.log.info('🔌 Connected to Mock In-Memory Redis (Local Mode)');
  } else {
    redisClient = new Redis(fastify.config.REDIS_URL, {
      maxRetriesPerRequest: null,
      showFriendlyErrorStack: true
    });

    redisClient.on('connect', () => {
      fastify.log.info('🔌 Redis connection established');
    });

    redisClient.on('error', (err: Error) => {
      fastify.log.error(`❌ Redis error: ${err.message}`);
    });
  }

  fastify.decorate('redis', redisClient as any);

  fastify.addHook('onClose', async (instance) => {
    if (instance.redis && typeof instance.redis.disconnect === 'function') {
      await instance.redis.disconnect();
    }
  });
};

export default fp(redisPlugin, { name: 'redis-plugin' });
export { MockRedis };
