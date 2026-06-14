import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword, verifyPassword } from './password.js';

const DEV_ADMIN_EMAIL = 'aastikmishra20@gmail.com';
const DEV_ADMIN_PASSWORD = 'aastik0003';
const DEV_ADMIN_NAME = 'Aastik Mishra';

type AdminBootstrapOptions = {
  nodeEnv: string;
  email?: string;
  password?: string;
  fullName?: string;
};

export async function ensureAdminUser(prisma: PrismaClient, options: AdminBootstrapOptions) {
  const useDevDefault = options.nodeEnv === 'development';
  const email = (options.email || (useDevDefault ? DEV_ADMIN_EMAIL : '')).toLowerCase().trim();
  const password = options.password || (useDevDefault ? DEV_ADMIN_PASSWORD : '');
  const fullName = (options.fullName || DEV_ADMIN_NAME).trim();

  if (!email || !password) {
    return;
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
