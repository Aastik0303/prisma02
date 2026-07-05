import { PrismaClient, User } from '@prisma/client';

type SafeUser = Omit<User, 'passwordHash' | 'mfaSecret' | 'mfaRecoveryCodes'>;
type UserMetadata = Record<string, any>;

const asMetadata = (metadata: unknown): UserMetadata => {
  return metadata && typeof metadata === 'object' && !Array.isArray(metadata)
    ? metadata as UserMetadata
    : {};
};

const firstValue = (metadata: UserMetadata, keys: string[]) => {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return null;
};

const passwordAlgorithm = (passwordHash?: string | null) => {
  if (!passwordHash) return null;
  if (passwordHash.startsWith('$argon2id$')) return 'argon2id';
  if (passwordHash.startsWith('$argon2i$')) return 'argon2i';
  if (passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$')) return 'bcrypt';
  return 'unknown';
};

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

  async updateUserProfile(id: string, data: { fullName?: string; avatarUrl?: string; metadata?: UserMetadata }): Promise<SafeUser | null> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: { metadata: true }
    });

    if (!existing) return null;

    const currentMetadata = asMetadata(existing.metadata);
    const nextMetadata = {
      ...currentMetadata,
      ...(data.metadata || {})
    };

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.fullName ? { fullName: data.fullName } : {}),
        ...(typeof data.avatarUrl === 'string' ? { avatarUrl: data.avatarUrl } : {}),
        metadata: nextMetadata
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
      }
    });
  }

  async getAdminUsersOverview(options: { query?: string; limit?: number } = {}) {
    const query = options.query?.trim();
    const limit = Math.min(Math.max(options.limit || 100, 1), 250);

    const where = query
      ? {
          OR: [
            { fullName: { contains: query, mode: 'insensitive' as const } },
            { email: { contains: query, mode: 'insensitive' as const } }
          ]
        }
      : {};

    const [users, totalUsers, verifiedUsers, mfaUsers, lockedUsers, recentAuditLogs] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          emailVerified: true,
          passwordHash: true,
          mfaEnabled: true,
          failedAttempts: true,
          lockedUntil: true,
          lastLoginAt: true,
          lastLoginIp: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              refreshTokens: true,
              authTokens: true,
              auditLogs: true,
              teamMemberships: true,
              ownedProjects: true,
              assignedTasks: true,
              sentMessages: true,
              receivedMessages: true
            }
          },
          refreshTokens: {
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
              id: true,
              family: true,
              revoked: true,
              revokedAt: true,
              revokedReason: true,
              expiresAt: true,
              createdAt: true,
              deviceInfo: true
            }
          },
          auditLogs: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              action: true,
              resource: true,
              ipAddress: true,
              userAgent: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { emailVerified: true } }),
      this.prisma.user.count({ where: { mfaEnabled: true } }),
      this.prisma.user.count({ where: { lockedUntil: { gt: new Date() } } }),
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          action: true,
          resource: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true
            }
          }
        }
      })
    ]);

    const now = Date.now();
    const formattedUsers = users.map((user) => {
      const metadata = asMetadata(user.metadata);
      const activeSessions = user.refreshTokens.filter(token => !token.revoked && token.expiresAt > new Date()).length;
      const lastActivityAt = user.auditLogs[0]?.createdAt || user.lastLoginAt || user.updatedAt;
      const daysSinceLastLogin = user.lastLoginAt
        ? Math.floor((now - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: firstValue(metadata, ['phone', 'phoneNumber', 'mobile', 'contactNumber']),
        location: firstValue(metadata, ['location', 'city', 'country']),
        college: firstValue(metadata, ['college', 'university', 'school']),
        degree: firstValue(metadata, ['degree', 'course', 'program']),
        year: firstValue(metadata, ['year', 'graduationYear']),
        avatarUrl: user.avatarUrl,
        role: user.role,
        emailVerified: user.emailVerified,
        mfaEnabled: user.mfaEnabled,
        failedAttempts: user.failedAttempts,
        lockedUntil: user.lockedUntil,
        lastLoginAt: user.lastLoginAt,
        lastLoginIp: user.lastLoginIp,
        daysSinceLastLogin,
        lastActivityAt,
        metadata,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        password: {
          stored: Boolean(user.passwordHash),
          algorithm: passwordAlgorithm(user.passwordHash),
          readableValue: 'Never exposed. Passwords are one-way hashed and cannot be viewed.',
          resetAction: 'Use forgot/reset password flow.'
        },
        counts: {
          refreshTokens: user._count.refreshTokens,
          activeSessions,
          authTokens: user._count.authTokens,
          auditLogs: user._count.auditLogs,
          teams: user._count.teamMemberships,
          ownedProjects: user._count.ownedProjects,
          assignedTasks: user._count.assignedTasks,
          sentMessages: user._count.sentMessages,
          receivedMessages: user._count.receivedMessages
        },
        sessions: user.refreshTokens.map(token => ({
          id: token.id,
          family: token.family,
          active: !token.revoked && token.expiresAt > new Date(),
          revoked: token.revoked,
          revokedAt: token.revokedAt,
          revokedReason: token.revokedReason,
          expiresAt: token.expiresAt,
          createdAt: token.createdAt,
          deviceInfo: token.deviceInfo
        })),
        recentActivity: user.auditLogs.map(log => ({
          id: log.id.toString(),
          action: log.action,
          resource: log.resource,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          createdAt: log.createdAt
        }))
      };
    });

    return {
      summary: {
        totalUsers,
        listedUsers: formattedUsers.length,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        mfaUsers,
        lockedUsers,
        usersWithPassword: formattedUsers.filter(user => user.password.stored).length,
        activeSessions: formattedUsers.reduce((total, user) => total + user.counts.activeSessions, 0)
      },
      users: formattedUsers,
      recentAuditLogs: recentAuditLogs.map(log => ({
        id: log.id.toString(),
        action: log.action,
        resource: log.resource,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
        user: log.user
      }))
    };
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
