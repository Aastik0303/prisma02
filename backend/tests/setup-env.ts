import { generateKeyPairSync, randomBytes } from 'crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'der'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'der'
  }
});

process.env.NODE_ENV = 'test';
process.env.PORT ??= '3001';
process.env.ALLOWED_ORIGINS ??= 'http://localhost:5173';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/prisma_auth?schema=public';
process.env.REDIS_URL ??= 'redis://localhost:6379/0';
process.env.JWT_PRIVATE_KEY ??= privateKey.toString('base64');
process.env.JWT_PUBLIC_KEY ??= publicKey.toString('base64');
process.env.JWT_ACCESS_EXPIRY ??= '900';
process.env.JWT_REFRESH_EXPIRY ??= '604800';
process.env.CSRF_SECRET ??= randomBytes(32).toString('hex');
process.env.RESEND_API_KEY ??= 're_test';
process.env.EMAIL_FROM ??= 'noreply@example.com';
process.env.ADMIN_EMAIL ??= 'admin@example.com';
process.env.FRONTEND_URL ??= 'http://localhost:5173';
process.env.FIELD_ENCRYPTION_KEY ??= randomBytes(32).toString('hex');
process.env.BCRYPT_ROUNDS ??= '4';
process.env.LOCKOUT_THRESHOLD ??= '5';
process.env.LOCKOUT_DURATION_MINUTES ??= '30';
