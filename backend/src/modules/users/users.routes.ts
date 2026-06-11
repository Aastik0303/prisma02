import { FastifyInstance } from 'fastify';
import { UsersService } from './users.service.js';
import { requireAuth, requireRole } from '../auth/auth.middleware.js';

export async function usersRoutes(fastify: FastifyInstance) {
  const usersService = new UsersService(fastify.prisma);

  // GET /api/v1/users/me
  // Fetches current authenticated user profile details
  fastify.get('/me', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const user = await usersService.getUserById(request.user!.id);
    if (!user) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Profile not found'
      });
    }
    return user;
  });

  // GET /api/v1/users/admin/users
  // Enforces requireRole('admin') guard
  fastify.get('/admin/users', {
    preHandler: [requireAuth, requireRole('admin')]
  }, async (request, reply) => {
    const users = await usersService.getAllUsers();
    return users;
  });
}
export default usersRoutes;
