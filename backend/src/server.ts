import { buildApp } from './app.js';
import { config } from './config/config.js';
import { initializeAuditQueue, closeAuditQueue } from './utils/audit.js';
import { initializeEmailQueue, closeEmailQueue } from './utils/email.js';

const start = async () => {
  try {
    // 1. Initialize BullMQ queues and workers
    await initializeAuditQueue();
    await initializeEmailQueue();

    // 2. Build and boot the Fastify application
    const app = await buildApp();

    const address = await app.listen({
      port: config.PORT,
      host: '0.0.0.0' // Expose globally for containers/host access
    });

    console.log(`🚀 Prisma Embedded Codes Auth Backend listening on ${address}`);

    // 3. Setup graceful shutdown hooks
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);

      // Set timeout for force close
      const forceCloseTimeout = setTimeout(() => {
        console.error('❌ Forcefully shutting down due to timeout...');
        process.exit(1);
      }, 10000);

      try {
        // Stop listening for new connections and close plugins (Prisma/Redis)
        await app.close();
        console.log('✅ Fastify server closed.');

        // Close BullMQ workers and queues
        await closeAuditQueue();
        await closeEmailQueue();
        console.log('✅ BullMQ queues closed.');

        clearTimeout(forceCloseTimeout);
        console.log('👋 Graceful shutdown complete. Exiting.');
        process.exit(0);
      } catch (err: any) {
        console.error(`❌ Error during graceful shutdown: ${err.message}`);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err: any) {
    console.error(`❌ Server failed to start: ${err.message}`);
    process.exit(1);
  }
};

start();
