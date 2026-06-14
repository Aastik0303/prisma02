import { FastifyInstance } from 'fastify';
import { ProjectsService } from './projects.service.js';
import { ProjectsController } from './projects.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

export async function projectsRoutes(fastify: FastifyInstance) {
  const projectsService = new ProjectsService(fastify.prisma);
  const controller = new ProjectsController(projectsService);

  fastify.addHook('preHandler', requireAuth);

  // Projects CRUD
  fastify.post('/', (req, rep) => controller.createProject(req, rep));
  fastify.get('/team/:teamId', (req, rep) => controller.getTeamProjects(req, rep));
  fastify.get('/:id', (req, rep) => controller.getProjectDetails(req, rep));

  // Documents
  fastify.post('/:id/documents', (req, rep) => controller.createDocument(req, rep));

  // Files
  fastify.post('/:id/files', (req, rep) => controller.addFile(req, rep));
}

export default projectsRoutes;
