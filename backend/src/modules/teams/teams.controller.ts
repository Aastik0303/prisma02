import { FastifyReply, FastifyRequest } from 'fastify';
import { TeamsService } from './teams.service.js';
import { 
  createTeamSchema, 
  inviteMemberSchema, 
  respondInvitationSchema, 
  updateMemberRoleSchema 
} from './teams.schema.js';

export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  async createTeam(request: FastifyRequest, reply: FastifyReply) {
    const body = createTeamSchema.parse(request.body);
    const userId = request.user!.id;

    const team = await this.teamsService.createTeam(userId, body);
    return reply.status(201).send(team);
  }

  async getMyTeams(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!.id;
    const teams = await this.teamsService.getTeamsByUser(userId);
    return reply.status(200).send(teams);
  }

  async getTeamDetails(request: FastifyRequest, reply: FastifyReply) {
    const { id: teamId } = request.params as { id: string };
    const userId = request.user!.id;

    // Check membership
    const member = await this.teamsService.getTeamMember(teamId, userId);
    if (!member && request.user!.role !== 'admin' && request.user!.role !== 'super_admin') {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'You are not a member of this team'
      });
    }

    const team = await this.teamsService.getTeamById(teamId);
    if (!team) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'Team not found'
      });
    }

    return reply.status(200).send(team);
  }

  async getTeamDashboard(request: FastifyRequest, reply: FastifyReply) {
    const { id: teamId } = request.params as { id: string };
    const userId = request.user!.id;

    // Check membership
    const member = await this.teamsService.getTeamMember(teamId, userId);
    if (!member && request.user!.role !== 'admin' && request.user!.role !== 'super_admin') {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'You are not a member of this team'
      });
    }

    const metrics = await this.teamsService.getTeamDashboardMetrics(teamId);
    return reply.status(200).send(metrics);
  }

  async inviteMember(request: FastifyRequest, reply: FastifyReply) {
    const { id: teamId } = request.params as { id: string };
    const body = inviteMemberSchema.parse(request.body);
    const userId = request.user!.id;

    // Only team LEADER can invite
    const member = await this.teamsService.getTeamMember(teamId, userId);
    if ((!member || member.role !== 'LEADER') && request.user!.role !== 'admin' && request.user!.role !== 'super_admin') {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'Only team leaders can invite new members'
      });
    }

    const invite = await this.teamsService.inviteMember(teamId, userId, body.inviteeEmail, body.role);
    return reply.status(201).send(invite);
  }

  async getMyInvitations(request: FastifyRequest, reply: FastifyReply) {
    const userEmail = request.user!.email;
    const invitations = await this.teamsService.getInvitationsByUser(userEmail);
    return reply.status(200).send(invitations);
  }

  async respondInvitation(request: FastifyRequest, reply: FastifyReply) {
    const { id: invitationId } = request.params as { id: string };
    const body = respondInvitationSchema.parse(request.body);
    const userId = request.user!.id;
    const userEmail = request.user!.email;

    const accept = body.status === 'ACCEPTED';
    const invite = await this.teamsService.respondToInvitation(invitationId, userId, userEmail, accept);
    return reply.status(200).send(invite);
  }

  async leaveTeam(request: FastifyRequest, reply: FastifyReply) {
    const { id: teamId } = request.params as { id: string };
    const userId = request.user!.id;

    await this.teamsService.leaveTeam(teamId, userId);
    return reply.status(200).send({ message: 'Left team successfully' });
  }

  async updateMemberRole(request: FastifyRequest, reply: FastifyReply) {
    const { id: teamId, memberId } = request.params as { id: string; memberId: string };
    const body = updateMemberRoleSchema.parse(request.body);
    const userId = request.user!.id;

    // Only LEADER can update roles
    const member = await this.teamsService.getTeamMember(teamId, userId);
    if ((!member || member.role !== 'LEADER') && request.user!.role !== 'admin' && request.user!.role !== 'super_admin') {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'Only team leaders can manage member roles'
      });
    }

    const updated = await this.teamsService.updateMemberRole(teamId, memberId, body.role);
    return reply.status(200).send(updated);
  }

  async removeMember(request: FastifyRequest, reply: FastifyReply) {
    const { id: teamId, memberId } = request.params as { id: string; memberId: string };
    const userId = request.user!.id;

    // Only LEADER can remove members
    const member = await this.teamsService.getTeamMember(teamId, userId);
    if ((!member || member.role !== 'LEADER') && request.user!.role !== 'admin' && request.user!.role !== 'super_admin') {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'FORBIDDEN',
        message: 'Only team leaders can remove members'
      });
    }

    await this.teamsService.removeMember(teamId, memberId);
    return reply.status(200).send({ message: 'Member removed successfully' });
  }
}
