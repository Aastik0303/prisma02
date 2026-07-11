import { PrismaClient, UserRole } from '@prisma/client';
import argon2 from 'argon2';

async function hashPassword(password) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  });
}

const prisma = new PrismaClient();

const email = process.argv[2];
const password = process.argv[3];
const fullName = process.argv[4] || 'Admin User';

if (!email || !password) {
  console.log('Usage: node promote-admin.js <email> <password> [fullName]');
  process.exit(1);
}

const normalizedEmail = email.toLowerCase().trim();

try {
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName,
        emailVerified: true,
        role: UserRole.super_admin,
        passwordHash: await hashPassword(password),
        failedAttempts: 0,
        lockedUntil: null
      }
    });
    console.log(`Created user ${normalizedEmail} as super admin.`);
  } else {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        fullName: existingUser.fullName || fullName,
        emailVerified: true,
        role: UserRole.super_admin,
        passwordHash: await hashPassword(password),
        failedAttempts: 0,
        lockedUntil: null
      }
    });
    console.log(`Updated user ${normalizedEmail} to super admin.`);
  }
} finally {
  await prisma.$disconnect();
}
