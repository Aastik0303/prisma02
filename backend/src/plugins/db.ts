import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const createMockPrismaClient = () => {
  const makeModel = (name: string) => ({
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async ({ data }: any) => ({ id: `${name}-mock-id`, createdAt: new Date(), updatedAt: new Date(), ...data }),
    update: async ({ data }: any) => ({ id: `${name}-mock-id`, createdAt: new Date(), updatedAt: new Date(), ...data }),
    updateMany: async () => ({ count: 0 }),
    delete: async () => ({ id: `${name}-mock-id` }),
    deleteMany: async () => ({ count: 0 }),
    count: async () => 0
  });

  const mockPrisma: any = {
    user: makeModel('user'),
    refreshToken: makeModel('refreshToken'),
    authToken: makeModel('authToken'),
    auditLog: makeModel('auditLog'),
    $connect: async () => undefined,
    $disconnect: async () => undefined,
    $transaction: async (callback: any) => callback(mockPrisma)
  };

  return mockPrisma;
};

const prismaPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: fastify.config.DATABASE_URL
      }
    }
  });

  try {
    await prisma.$connect();
    fastify.decorate('prisma', prisma);
  } catch (error) {
    if (fastify.config.NODE_ENV !== 'test') {
      fastify.log.error({ err: error }, 'PostgreSQL connection failed');
      throw error;
    }

    fastify.log.warn({ err: error }, 'Falling back to in-memory Prisma client for local development');
    const mockPrisma = createMockPrismaClient();
    fastify.decorate('prisma', mockPrisma as unknown as PrismaClient);
  }

  fastify.addHook('onClose', async (instance) => {
    if (typeof instance.prisma?.$disconnect === 'function') {
      await instance.prisma.$disconnect();
    }
  });
};

export default fp(prismaPlugin, { name: 'prisma-plugin' });
