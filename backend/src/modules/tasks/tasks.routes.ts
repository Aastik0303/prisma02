import { FastifyInstance } from 'fastify';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

export async function tasksRoutes(fastify: FastifyInstance) {
  const tasksService = new TasksService(fastify.prisma);
  const controller = new TasksController(tasksService);

  fastify.addHook('preHandler', requireAuth);

  // Tasks CRUD
  fastify.post('/', (req, rep) => controller.createTask(req, rep));
  fastify.patch('/:id/status', (req, rep) => controller.updateTaskStatus(req, rep));
  fastify.patch('/:id/assign', (req, rep) => controller.assignTask(req, rep));

  // Comments
  fastify.post('/:id/comments', (req, rep) => controller.createComment(req, rep));
  fastify.get('/:id/comments', (req, rep) => controller.getComments(req, rep));
}

export default tasksRoutes;
