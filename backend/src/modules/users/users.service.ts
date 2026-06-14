import { PrismaClient, User } from '@prisma/client';

type SafeUser = Omit<User, 'passwordHash' | 'mfaSecret' | 'mfaRecoveryCodes'>;

export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async getUserById(id: string): Promise<SafeUser | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        mfaEnabled: true,
        failedAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        lastLoginIp: true,
        metadata: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getAllUsers(): Promise<SafeUser[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        mfaEnabled: true,
        failedAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        lastLoginIp: true,
        metadata: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchRegisteredUsers(options: {
    query?: string;
    excludeUserId?: string;
    limit?: number;
  }): Promise<SafeUser[]> {
    const query = options.query?.trim();
    const limit = Math.min(Math.max(options.limit || 12, 1), 25);

    return await this.prisma.user.findMany({
      where: {
        ...(options.excludeUserId ? { id: { not: options.excludeUserId } } : {}),
        ...(query
          ? {
              OR: [
                { fullName: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        mfaEnabled: true,
        failedAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        lastLoginIp: true,
        metadata: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
