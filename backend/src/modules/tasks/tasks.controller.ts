import { FastifyReply, FastifyRequest } from 'fastify';
import { TasksService } from './tasks.service.js';
import { 
  createTaskSchema, 
  updateTaskStatusSchema, 
  assignTaskSchema, 
  createCommentSchema 
} from './tasks.schema.js';

export class TasksController {
  constructor(private tasksService: TasksService) {}

  private async checkTeamMembership(request: FastifyRequest, teamId: string) {
    const userId = request.user!.id;
    const isMember = await request.server.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    return !!isMember || request.user!.role === 'admin' || request.user!.role === 'super_admin';
  }

  async createTask(request: FastifyRequest, reply: FastifyReply) {
    const body = createTaskSchema.parse(request.body);
    const userId = request.user!.id;

    // Fetch project to check teamId
    const project = await request.server.prisma.project.findUnique({
      where: { id: body.projectId }
    });

    if (!project) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Project not found'
      });
    }

    if (project.teamId) {
      const isMember = await this.checkTeamMembership(request, project.teamId);
      if (!isMember) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'FORBIDDEN',
          message: 'You are not a member of the team that owns this project'
        });
      }
    }

    const task = await this.tasksService.createTask(userId, body);
    return reply.status(201).send(task);
  }

  async updateTaskStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = updateTaskStatusSchema.parse(request.body);

    const task = await this.tasksService.getTaskById(id);
    if (!task) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Task not found'
      });
    }

    if (task.project.teamId) {
      const isMember = await this.checkTeamMembership(request, task.project.teamId);
      if (!isMember) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'FORBIDDEN',
          message: 'You are not a member of the team that owns this project'
        });
      }
    }

    const updatedTask = await this.tasksService.updateTaskStatus(id, body.status);
    return reply.status(200).send(updatedTask);
  }

  async assignTask(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = assignTaskSchema.parse(request.body);

    const task = await this.tasksService.getTaskById(id);
    if (!task) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Task not found'
      });
    }

    if (task.project.teamId) {
      const isMember = await this.checkTeamMembership(request, task.project.teamId);
      if (!isMember) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'FORBIDDEN',
          message: 'You are not a member of the team that owns this project'
        });
      }
      
      // If assigning to a user, make sure the assignee is also in the team
      if (body.assigneeId) {
        const isAssigneeInTeam = await request.server.prisma.teamMember.findUnique({
          where: {
            teamId_userId: {
              teamId: task.project.teamId,
              userId: body.assigneeId
            }
          }
        });

        if (!isAssigneeInTeam) {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            code: 'INVALID_ASSIGNEE',
            message: 'Assignee is not a member of the team'
          });
        }
      }
    }

    const updatedTask = await this.tasksService.assignTask(id, body.assigneeId === undefined ? null : body.assigneeId);
    return reply.status(200).send(updatedTask);
  }

  async createComment(request: FastifyRequest, reply: FastifyReply) {
    const { id: taskId } = request.params as { id: string };
    const body = createCommentSchema.parse(request.body);
    const userId = request.user!.id;

    const task = await this.tasksService.getTaskById(taskId);
    if (!task) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Task not found'
      });
    }

    if (task.project.teamId) {
      const isMember = await this.checkTeamMembership(request, task.project.teamId);
      if (!isMember) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'FORBIDDEN',
          message: 'You are not a member of the team that owns this project'
        });
      }
    }

    const comment = await this.tasksService.createComment(taskId, userId, body.content);
    return reply.status(201).send(comment);
  }

  async getComments(request: FastifyRequest, reply: FastifyReply) {
    const { id: taskId } = request.params as { id: string };

    const task = await this.tasksService.getTaskById(taskId);
    if (!task) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Task not found'
      });
    }

    if (task.project.teamId) {
      const isMember = await this.checkTeamMembership(request, task.project.teamId);
      if (!isMember) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'FORBIDDEN',
          message: 'You are not a member of the team that owns this project'
        });
      }
    }

    const comments = await this.tasksService.getCommentsByTask(taskId);
    return reply.status(200).send(comments);
  }
}
