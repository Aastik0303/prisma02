import { PrismaClient, UserRole } from '@prisma/client';
import { verifyPassword } from './password.js';

const developerAccounts = [
  {
    email: 'rishabhparashari068@gmail.com',
    fullName: 'Rishabh Parashari'
  },
  {
    email: 'aastikmishra20@gmail.com',
    fullName: 'Aastik Mishra'
  }
];

function developerPasswordHashes(): Record<string, string> {
  try {
    return JSON.parse(process.env.DEVELOPER_PASSWORD_HASHES || '{}');
  } catch {
    return {};
  }
}

export async function verifyDeveloperCredential(email: string, password: string) {
  const account = developerAccounts.find(candidate => candidate.email === email.toLowerCase().trim());
  if (!account) return false;
  const passwordHash = developerPasswordHashes()[account.email];
  if (!passwordHash) return false;
  return verifyPassword(password, passwordHash);
}

export async function ensureDeveloperUsers(prisma: PrismaClient) {
  for (const account of developerAccounts) {
    const existingUser = await prisma.user.findUnique({
      where: { email: account.email }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: account.email,
          fullName: account.fullName,
          emailVerified: true,
          role: UserRole.student,
          failedAttempts: 0,
          lockedUntil: null
        }
      });
      continue;
    }

    // Developer credentials are intentionally separate from the user's
    // website password, so existing registered-user data is left unchanged.
  }
}
