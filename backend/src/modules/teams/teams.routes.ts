import { FastifyInstance } from 'fastify';
import { TeamsService } from './teams.service.js';
import { TeamsController } from './teams.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

export async function teamsRoutes(fastify: FastifyInstance) {
  const teamsService = new TeamsService(fastify.prisma);
  const controller = new TeamsController(teamsService);

  // All team endpoints require authentication
  fastify.addHook('preHandler', requireAuth);

  // Teams CRUD & Dashboard
  fastify.post('/', (req, rep) => controller.createTeam(req, rep));
  fastify.get('/', (req, rep) => controller.getMyTeams(req, rep));
  fastify.get('/:id', (req, rep) => controller.getTeamDetails(req, rep));
  fastify.get('/:id/dashboard', (req, rep) => controller.getTeamDashboard(req, rep));
  fastify.post('/:id/leave', (req, rep) => controller.leaveTeam(req, rep));

  // Invitations
  fastify.get('/invitations', (req, rep) => controller.getMyInvitations(req, rep));
  fastify.post('/:id/invitations', (req, rep) => controller.inviteMember(req, rep));
  fastify.post('/invitations/:id/respond', (req, rep) => controller.respondInvitation(req, rep));

  // Members Management
  fastify.put('/:id/members/:memberId', (req, rep) => controller.updateMemberRole(req, rep));
  fastify.delete('/:id/members/:memberId', (req, rep) => controller.removeMember(req, rep));
}

export default teamsRoutes;
