import { PrismaClient } from '@prisma/client';

export class ChatService {
  constructor(private prisma: PrismaClient) {}

  async saveMessage(data: {
    teamId?: string | null;
    projectId?: string | null;
    senderId: string;
    receiverId?: string | null;
    content: string;
    isAnnouncement?: boolean;
  }) {
    return this.prisma.chatMessage.create({
      data: {
        teamId: data.teamId || null,
        projectId: data.projectId || null,
        senderId: data.senderId,
        receiverId: data.receiverId || null,
        content: data.content,
        isAnnouncement: data.isAnnouncement || false
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  async getMessages(filters: {
    teamId?: string;
    projectId?: string;
    userId: string;
    receiverId?: string;
  }) {
    // Determine the query
    if (filters.receiverId) {
      // 1-on-1 direct message between filters.userId and filters.receiverId
      return this.prisma.chatMessage.findMany({
        where: {
          OR: [
            { senderId: filters.userId, receiverId: filters.receiverId },
            { senderId: filters.receiverId, receiverId: filters.userId }
          ],
          teamId: null,
          projectId: null
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'asc' },
        take: 100
      });
    }

    if (filters.projectId) {
      // Project chat
      return this.prisma.chatMessage.findMany({
        where: { projectId: filters.projectId },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'asc' },
        take: 100
      });
    }

    if (filters.teamId) {
      // Team chat
      return this.prisma.chatMessage.findMany({
        where: { teamId: filters.teamId, projectId: null, receiverId: null },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { createdAt: 'asc' },
        take: 100
      });
    }

    // Default: empty list or error
    return [];
  }
}
