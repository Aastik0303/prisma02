import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import crypto from 'crypto';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const createMockPrismaClient = () => {
  const state: Record<string, any[]> = {
    user: [],
    refreshToken: [],
    authToken: [],
    auditLog: [],
    chatMessage: [],
    catalogCourse: [],
    catalogProject: []
  };

  const matchesWhere = (record: any, where: any = {}) => {
    if (!where || Object.keys(where).length === 0) return true;

    if (where.OR) {
      return where.OR.some((condition: any) => matchesWhere(record, condition));
    }

    return Object.entries(where).every(([key, expected]: [string, any]) => {
      const actual = record[key];

      if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
        if ('contains' in expected) {
          return String(actual || '').toLowerCase().includes(String(expected.contains).toLowerCase());
        }
        if ('gt' in expected) {
          return actual && actual > expected.gt;
        }
        if ('not' in expected) {
          return actual !== expected.not;
        }
      }

      return actual === expected;
    });
  };

  const applySelect = (record: any, select?: Record<string, any>) => {
    if (!record || !select) return record;

    return Object.entries(select).reduce((selected: any, [key, enabled]) => {
      if (enabled === true) {
        selected[key] = record[key];
      }
      return selected;
    }, {});
  };

  const withUserRelations = (user: any, args: any = {}) => {
    if (!user) return user;

    const next = { ...user };
    if (args.select?._count) {
      next._count = {
        refreshTokens: state.refreshToken.filter(token => token.userId === user.id).length,
        authTokens: state.authToken.filter(token => token.userId === user.id).length,
        auditLogs: state.auditLog.filter(log => log.userId === user.id).length,
        teamMemberships: 0,
        ownedProjects: 0,
        assignedTasks: 0,
        sentMessages: state.chatMessage.filter(message => message.senderId === user.id).length,
        receivedMessages: state.chatMessage.filter(message => message.receiverId === user.id).length
      };
    }

    if (args.select?.refreshTokens) {
      next.refreshTokens = state.refreshToken
        .filter(token => token.userId === user.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, args.select.refreshTokens.take || undefined);
    }

    if (args.select?.auditLogs) {
      next.auditLogs = state.auditLog
        .filter(log => log.userId === user.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, args.select.auditLogs.take || undefined);
    }

    return applySelect(next, args.select);
  };

  const makeModel = (name: string) => ({
    findUnique: async (args: any = {}) => {
      const record = state[name].find(item => matchesWhere(item, args.where)) || null;
      if (name === 'refreshToken' && record && args.include?.user) {
        return { ...record, user: state.user.find(user => user.id === record.userId) || null };
      }
      return applySelect(record, args.select);
    },
    findFirst: async (args: any = {}) => {
      const record = state[name].find(item => matchesWhere(item, args.where)) || null;
      return applySelect(record, args.select);
    },
    findMany: async (args: any = {}) => {
      let records = state[name].filter(item => matchesWhere(item, args.where));

      if (args.orderBy?.createdAt === 'desc') {
        records = records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      if (typeof args.take === 'number') {
        records = records.slice(0, args.take);
      }

      if (name === 'user') {
        return records.map(record => withUserRelations(record, args));
      }

      if (name === 'auditLog' && args.select?.user) {
        return records.map(record => ({
          ...applySelect(record, args.select),
          user: applySelect(state.user.find(user => user.id === record.userId) || null, args.select.user.select)
        }));
      }

      return records.map(record => applySelect(record, args.select));
    },
    create: async ({ data }: any) => {
      const now = new Date();
      const record = {
        id: name === 'auditLog' ? BigInt(state[name].length + 1) : crypto.randomUUID(),
        emailVerified: false,
        role: 'student',
        failedAttempts: 0,
        lockedUntil: null,
        mfaEnabled: false,
        mfaSecret: null,
        mfaRecoveryCodes: [],
        revoked: false,
        revokedAt: null,
        revokedReason: null,
        createdAt: now,
        updatedAt: now,
        ...data
      };
      state[name].push(record);
      return record;
    },
    update: async ({ where, data, select }: any) => {
      const index = state[name].findIndex(item => matchesWhere(item, where));
      if (index === -1) throw new Error(`${name} not found`);

      state[name][index] = {
        ...state[name][index],
        ...data,
        updatedAt: new Date()
      };
      return applySelect(state[name][index], select);
    },
    updateMany: async ({ where, data }: any = {}) => {
      let count = 0;
      state[name] = state[name].map(item => {
        if (!matchesWhere(item, where)) return item;
        count += 1;
        return { ...item, ...data, updatedAt: new Date() };
      });
      return { count };
    },
    delete: async ({ where }: any) => {
      const index = state[name].findIndex(item => matchesWhere(item, where));
      if (index === -1) throw new Error(`${name} not found`);
      const [deleted] = state[name].splice(index, 1);
      return deleted;
    },
    deleteMany: async ({ where }: any = {}) => {
      const originalLength = state[name].length;
      state[name] = state[name].filter(item => !matchesWhere(item, where));
      return { count: originalLength - state[name].length };
    },
    count: async (args: any = {}) => state[name].filter(item => matchesWhere(item, args.where)).length
  });

  const mockPrisma: any = {
    user: makeModel('user'),
    refreshToken: makeModel('refreshToken'),
    authToken: makeModel('authToken'),
    auditLog: makeModel('auditLog'),
    chatMessage: makeModel('chatMessage'),
    catalogCourse: makeModel('catalogCourse'),
    catalogProject: makeModel('catalogProject'),
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
    if (!['development', 'test'].includes(fastify.config.NODE_ENV)) {
      fastify.log.error({ err: error }, 'PostgreSQL connection failed');
      throw error;
    }

    fastify.log.warn({ err: error }, 'Falling back to in-memory Prisma client');
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
