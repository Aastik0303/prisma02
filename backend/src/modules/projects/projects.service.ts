import { PrismaClient } from '@prisma/client';

export class ProjectsService {
  constructor(private prisma: PrismaClient) {}

  async createProject(userId: string, data: { title: string; description?: string; difficulty: string; track: string; teamId?: string }) {
    return this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        track: data.track,
        teamId: data.teamId || null,
        ownerId: userId
      }
    });
  }

  async getProjectsByTeam(teamId: string) {
    return this.prisma.project.findMany({
      where: { teamId },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });
  }

  async getProjectById(projectId: string) {
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        },
        tasks: {
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
          },
          orderBy: { createdAt: 'asc' }
        },
        documents: {
          include: {
            creator: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: { updatedAt: 'desc' }
        },
        files: {
          include: {
            uploader: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async createDocument(projectId: string, creatorId: string, data: { title: string; content: string }) {
    return this.prisma.sharedDocument.create({
      data: {
        projectId,
        creatorId,
        title: data.title,
        content: data.content
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }

  async updateDocument(documentId: string, data: { title: string; content: string }) {
    return this.prisma.sharedDocument.update({
      where: { id: documentId },
      data: {
        title: data.title,
        content: data.content
      }
    });
  }

  async getDocumentById(documentId: string) {
    return this.prisma.sharedDocument.findUnique({
      where: { id: documentId }
    });
  }

  async addFile(projectId: string, uploaderId: string, data: { name: string; url: string; size: number; mimeType: string }) {
    return this.prisma.sharedFile.create({
      data: {
        projectId,
        uploaderId,
        name: data.name,
        url: data.url,
        size: data.size,
        mimeType: data.mimeType
      },
      include: {
        uploader: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  }
}
