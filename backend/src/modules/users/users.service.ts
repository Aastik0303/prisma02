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
}
