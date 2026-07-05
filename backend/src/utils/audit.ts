import { Queue, Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config.js';

interface AuditLogPayload {
  userId?: string | null;
  action: string;
  resource?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
}

const AUDIT_QUEUE_NAME = 'audit-logs';
let auditQueue: Queue | null = null;
let auditWorker: Worker | null = null;

// Initialize Prisma locally for worker if not running inside Fastify context
const prisma = new PrismaClient();

/**
 * Initializes the BullMQ Audit Log Queue and Worker.
 * In test mode, this is skipped to avoid starting external Redis workers.
 */
export async function initializeAuditQueue() {
  if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
    return;
  }

  try {
    const connectionOpts = {
      url: config.REDIS_URL
    };

    // Initialize Queue
    auditQueue = new Queue(AUDIT_QUEUE_NAME, {
      connection: connectionOpts
    });

    // Initialize Worker to process and save audit logs to the database
    auditWorker = new Worker(
      AUDIT_QUEUE_NAME,
      async (job) => {
        const payload = job.data as AuditLogPayload;
        await prisma.auditLog.create({
          data: {
            userId: payload.userId || null,
            action: payload.action,
            resource: payload.resource || null,
            ipAddress: payload.ipAddress || null,
            userAgent: payload.userAgent || null,
            metadata: payload.metadata || {}
          }
        });
      },
      {
        connection: connectionOpts,
        concurrency: 5
      }
    );

    auditWorker.on('failed', (job, err) => {
      console.error(`❌ Audit Log Job [${job?.id}] failed: ${err.message}`);
    });
  } catch (error: any) {
    console.error(`⚠️ Failed to initialize BullMQ audit queue: ${error.message}`);
  }
}

/**
 * Log an audit event.
 * Dispatches to BullMQ in development/production, or writes directly to DB in test mode.
 */
export async function logAuditEvent(payload: AuditLogPayload) {
  try {
    if (config.NODE_ENV === 'development' && !auditQueue) {
      return;
    }

    if (config.NODE_ENV === 'test') {
      // In test mode, bypass queue to write synchronously to the DB and avoid Redis overhead
      await prisma.auditLog.create({
        data: {
          userId: payload.userId || null,
          action: payload.action,
          resource: payload.resource || null,
          ipAddress: payload.ipAddress || null,
          userAgent: payload.userAgent || null,
          metadata: payload.metadata || {}
        }
      });
      return;
    }

    if (auditQueue) {
      await auditQueue.add('log', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: 1000 // keep last 1000 failures for debugging
      });
    } else {
      // Fallback if queue is not initialized
      await prisma.auditLog.create({
        data: {
          userId: payload.userId || null,
          action: payload.action,
          resource: payload.resource || null,
          ipAddress: payload.ipAddress || null,
          userAgent: payload.userAgent || null,
          metadata: payload.metadata || {}
        }
      });
    }
  } catch (error: any) {
    console.error(`⚠️ Audit log event dispatch failed: ${error.message}`, payload);
  }
}

/**
 * Shut down the BullMQ components gracefully.
 */
export async function closeAuditQueue() {
  if (auditWorker) {
    await auditWorker.close();
  }
  if (auditQueue) {
    await auditQueue.close();
  }
  await prisma.$disconnect();
}
export default { initializeAuditQueue, logAuditEvent, closeAuditQueue };
