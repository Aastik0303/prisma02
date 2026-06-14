import { PrismaClient } from '@prisma/client';

export class TasksService {
  constructor(private prisma: PrismaClient) {}

  async createTask(userId: string, data: { projectId: string; title: string; description?: string; status: string; priority: string; dueDate?: string; assigneeId?: string | null }) {
    return this.prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        creatorId: userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assigneeId: data.assigneeId || null
      },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        },
        creator: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  async getTaskById(taskId: string) {
    return this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true
      }
    });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  async assignTask(taskId: string, assigneeId: string | null) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });
  }

  async createComment(taskId: string, userId: string, content: string) {
    return this.prisma.taskComment.create({
      data: {
        taskId,
        userId,
        content
      },
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
  }

  async getCommentsByTask(taskId: string) {
    return this.prisma.taskComment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }
}
