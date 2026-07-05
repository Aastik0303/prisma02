import { PrismaClient } from '@prisma/client';

export class TeamsService {
  constructor(private prisma: PrismaClient) {}

  async createTeam(userId: string, data: { name: string; description?: string }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the team
      const team = await tx.team.create({
        data: {
          name: data.name,
          description: data.description
        }
      });

      // 2. Add creator as LEADER
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId,
          role: 'LEADER'
        }
      });

      return team;
    });
  }

  async getTeamsByUser(userId: string) {
    return this.prisma.team.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true
              }
            }
          }
        },
        projects: true
      }
    });
  }

  async getTeamById(teamId: string) {
    return this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true
              }
            }
          }
        },
        projects: {
          include: {
            tasks: true
          }
        }
      }
    });
  }

  async getTeamMember(teamId: string, userId: string) {
    return this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });
  }

  async inviteMember(teamId: string, inviterId: string, inviteeEmail: string, role: string) {
    // 1. Check if user is already a member
    const invitee = await this.prisma.user.findUnique({
      where: { email: inviteeEmail }
    });

    if (invitee) {
      const existingMember = await this.prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: invitee.id
          }
        }
      });
      if (existingMember) {
        throw { statusCode: 400, code: 'ALREADY_MEMBER', message: 'User is already a member of this team' };
      }
    }

    // 2. Check if a pending invite already exists
    const existingInvite = await this.prisma.teamInvitation.findFirst({
      where: {
        teamId,
        inviteeEmail,
        status: 'PENDING'
      }
    });

    if (existingInvite) {
      throw { statusCode: 400, code: 'INVITATION_ALREADY_SENT', message: 'A pending invitation has already been sent to this user' };
    }

    // 3. Create the invitation
    return this.prisma.teamInvitation.create({
      data: {
        teamId,
        inviterId,
        inviteeEmail,
        role,
        status: 'PENDING'
      }
    });
  }

  async getInvitationsByUser(email: string) {
    return this.prisma.teamInvitation.findMany({
      where: {
        inviteeEmail: email.toLowerCase().trim(),
        status: 'PENDING'
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        inviter: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    });
  }

  async respondToInvitation(invitationId: string, userId: string, userEmail: string, accept: boolean) {
    const invite = await this.prisma.teamInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invite) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Invitation not found' };
    }

    if (invite.inviteeEmail.toLowerCase() !== userEmail.toLowerCase()) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You are not authorized to respond to this invitation' };
    }

    if (invite.status !== 'PENDING') {
      throw { statusCode: 400, code: 'ALREADY_PROCESSED', message: 'This invitation has already been processed' };
    }

    return this.prisma.$transaction(async (tx) => {
      const status = accept ? 'ACCEPTED' : 'REJECTED';
      
      const updatedInvite = await tx.teamInvitation.update({
        where: { id: invitationId },
        data: { status }
      });

      if (accept) {
        // Double check if already member
        const existingMember = await tx.teamMember.findUnique({
          where: {
            teamId_userId: {
              teamId: invite.teamId,
              userId
            }
          }
        });

        if (!existingMember) {
          await tx.teamMember.create({
            data: {
              teamId: invite.teamId,
              userId,
              role: invite.role
            }
          });
        }
      }

      return updatedInvite;
    });
  }

  async leaveTeam(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!member) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'You are not a member of this team' };
    }

    // If they are the last leader, they can't leave without promoting someone else
    if (member.role === 'LEADER') {
      const leadersCount = await this.prisma.teamMember.count({
        where: {
          teamId,
          role: 'LEADER'
        }
      });

      const membersCount = await this.prisma.teamMember.count({
        where: { teamId }
      });

      if (leadersCount === 1 && membersCount > 1) {
        throw {
          statusCode: 400,
          code: 'LAST_LEADER',
          message: 'You are the only team leader. Please promote another member to leader before leaving.'
        };
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.teamMember.delete({
        where: {
          teamId_userId: {
            teamId,
            userId
          }
        }
      });

      // If team has no members left, we can delete the team or keep it.
      // Let's delete the team to keep it clean.
      const membersLeft = await tx.teamMember.count({
        where: { teamId }
      });

      if (membersLeft === 0) {
        await tx.team.delete({
          where: { id: teamId }
        });
      }
    });
  }

  async updateMemberRole(teamId: string, memberId: string, role: string) {
    return this.prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId: memberId
        }
      },
      data: { role }
    });
  }

  async removeMember(teamId: string, memberId: string) {
    return this.prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: memberId
        }
      }
    });
  }

  async getTeamDashboardMetrics(teamId: string) {
    const projects = await this.prisma.project.findMany({
      where: { teamId },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    const members = await this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });

    // Compute metrics
    let totalTasks = 0;
    let completedTasks = 0;
    const taskStatusCounts = {
      TO_DO: 0,
      IN_PROGRESS: 0,
      UNDER_REVIEW: 0,
      COMPLETED: 0
    };

    const contributions: Record<string, { completed: number; total: number; name: string }> = {};

    members.forEach((m) => {
      contributions[m.userId] = {
        completed: 0,
        total: 0,
        name: m.user.fullName
      };
    });

    projects.forEach((proj) => {
      proj.tasks.forEach((task) => {
        totalTasks++;
        const status = task.status as keyof typeof taskStatusCounts;
        if (taskStatusCounts[status] !== undefined) {
          taskStatusCounts[status]++;
        }

        if (task.status === 'COMPLETED') {
          completedTasks++;
        }

        if (task.assigneeId && contributions[task.assigneeId]) {
          contributions[task.assigneeId].total++;
          if (task.status === 'COMPLETED') {
            contributions[task.assigneeId].completed++;
          }
        }
      });
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      projectsCount: projects.length,
      membersCount: members.length,
      totalTasks,
      completedTasks,
      completionRate,
      taskStatusCounts,
      contributions: Object.entries(contributions).map(([userId, val]) => ({
        userId,
        name: val.name,
        completedTasks: val.completed,
        totalTasks: val.total
      })),
      projectsSummary: projects.map((p) => {
        const completed = p.tasks.filter((t) => t.status === 'COMPLETED').length;
        const total = p.tasks.length;
        return {
          id: p.id,
          title: p.title,
          status: p.status,
          totalTasks: total,
          completedTasks: completed,
          completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      })
    };
  }
}
