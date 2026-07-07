import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword, verifyPassword } from './password.js';

const DEFAULT_ADMIN_NAME = 'System Administrator';

type AdminBootstrapOptions = {
  nodeEnv: string;
  email?: string;
  password?: string;
  fullName?: string;
};

export async function ensureAdminUser(prisma: PrismaClient, options: AdminBootstrapOptions) {
  const email = (options.email ?? process.env.ADMIN_EMAIL ?? '').toLowerCase().trim();
  const password = options.password ?? process.env.ADMIN_PASSWORD ?? '';
  const fullName = (options.fullName ?? process.env.ADMIN_FULL_NAME ?? DEFAULT_ADMIN_NAME).trim();

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required to bootstrap the admin user.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        fullName,
        emailVerified: true,
        role: UserRole.super_admin,
        passwordHash: await hashPassword(password),
        failedAttempts: 0,
        lockedUntil: null
      }
    });
    return;
  }

  const existingPasswordWorks = existingUser.passwordHash
    ? await verifyPassword(password, existingUser.passwordHash)
    : false;

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      fullName: existingUser.fullName || fullName,
      emailVerified: true,
      role: UserRole.super_admin,
      passwordHash: existingPasswordWorks ? existingUser.passwordHash : await hashPassword(password),
      failedAttempts: 0,
      lockedUntil: null
    }
  });
}
