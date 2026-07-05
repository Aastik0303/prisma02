import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectsService } from './projects.service.js';
import { 
  createProjectSchema, 
  createDocumentSchema, 
  createFileSchema 
} from './projects.schema.js';

export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

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

  async createProject(request: FastifyRequest, reply: FastifyReply) {
    const body = createProjectSchema.parse(request.body);
    const userId = request.user!.id;

    if (body.teamId) {
      const isMember = await this.checkTeamMembership(request, body.teamId);
      if (!isMember) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'FORBIDDEN',
          message: 'You must be a member of the team to create a project for it'
        });
      }
    }

    const project = await this.projectsService.createProject(userId, body);
    return reply.status(201).send(project);
  }

  async getTeamProjects(request: FastifyRequest, reply: FastifyReply) {
    const { teamId } = request.params as { teamId: string };
    const isMember = await this.checkTeamMembership(request, teamId);
    
    if (!isMember) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'You are not a member of this team'
      });
    }

    const projects = await this.projectsService.getProjectsByTeam(teamId);
    return reply.status(200).send(projects);
  }

  async getProjectDetails(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const project = await this.projectsService.getProjectById(id);

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
    } else if (project.ownerId !== request.user!.id && request.user!.role !== 'admin' && request.user!.role !== 'super_admin') {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'You do not have permission to view this project'
      });
    }

    return reply.status(200).send(project);
  }

  async createDocument(request: FastifyRequest, reply: FastifyReply) {
    const { id: projectId } = request.params as { id: string };
    const body = createDocumentSchema.parse(request.body);
    const userId = request.user!.id;

    const project = await this.projectsService.getProjectById(projectId);
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
          message: 'You are not a member of this team'
        });
      }
    }

    const doc = await this.projectsService.createDocument(projectId, userId, body);
    return reply.status(201).send(doc);
  }

  async addFile(request: FastifyRequest, reply: FastifyReply) {
    const { id: projectId } = request.params as { id: string };
    const body = createFileSchema.parse(request.body);
    const userId = request.user!.id;

    const project = await this.projectsService.getProjectById(projectId);
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
          message: 'You are not a member of this team'
        });
      }
    }

    // Secure File Upload Validation:
    // Ensure size does not exceed 10MB, mime type is valid (pdf, zip, images, etc.)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_MIME_TYPES = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'image/jpeg',
      'image/png',
      'text/plain',
      'text/markdown',
      'application/json'
    ];

    if (body.size > MAX_FILE_SIZE) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'FILE_TOO_LARGE',
        message: 'File size exceeds the 10MB limit'
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(body.mimeType)) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_FILE_TYPE',
        message: 'File type is not permitted. Only PDF, ZIP, JPG, PNG, TXT, MD, and JSON files are allowed.'
      });
    }

    const file = await this.projectsService.addFile(projectId, userId, body);
    return reply.status(201).send(file);
  }
}
