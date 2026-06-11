import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  ALLOWED_ORIGINS: z.string().transform(val => val.split(',').map(o => o.trim())),
  DATABASE_URL: z.string().url(),
  DATABASE_REPLICA_URL: z.string().url().optional(),
  REDIS_URL: z.string(),
  JWT_PRIVATE_KEY_BASE64: z.string().min(1, 'Private key is required').or(z.literal('')),
  JWT_PUBLIC_KEY_BASE64: z.string().min(1, 'Public key is required').or(z.literal('')),
  JWT_ACCESS_EXPIRY: z.coerce.number().default(900),
  JWT_REFRESH_EXPIRY: z.coerce.number().default(604800),
  CSRF_SECRET: z.string().min(32, 'CSRF Secret must be at least 32 characters').default('csrf_secret_key_minimum_length_32_chars_fallback'),
  RESEND_API_KEY: z.string().default('re_mock_key'),
  EMAIL_FROM: z.string().email().default('noreply@prismaembedded.codes'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  FIELD_ENCRYPTION_KEY: z.string().length(64, 'Encryption key must be 32-byte hex (64 hex characters)'),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  LOCKOUT_THRESHOLD: z.coerce.number().default(5),
  LOCKOUT_DURATION_MINUTES: z.coerce.number().default(30)
});

const getEnvOrFallback = () => {
  // If running in Vitest test environment, load default fallback values so tests don't fail for missing secrets
  if (process.env.NODE_ENV === 'test') {
    return {
      NODE_ENV: 'test',
      PORT: 3001,
      ALLOWED_ORIGINS: 'http://localhost:5173',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/prisma_auth?schema=public',
      REDIS_URL: 'redis://localhost:6379/0',
      JWT_PRIVATE_KEY_BASE64: 'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgfXm/sXq62o/zFz/15W43YqH0gC4XpZ3zP/wK7Gg9R2qhRANCAARm7oX6nSfZfS6WqT92cZ3l8m+h4mBwL2P4uP8p1YyN7hUjT+VnQ37OQhC5V3V6J7cZ9Xz8QxY2U7f5Kz8O1k',
      JWT_PUBLIC_KEY_BASE64: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEZu6F+p0n2X0ulqk/dnGd5fJvoeJgcC9j+Lj/KdWMre4VI0/lZ0N+zkIQuVd1eie3GfV8/EMWNlO3+Ss/DtZH',
      JWT_ACCESS_EXPIRY: 900,
      JWT_REFRESH_EXPIRY: 604800,
      CSRF_SECRET: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      RESEND_API_KEY: 're_test',
      EMAIL_FROM: 'noreply@prismaembedded.codes',
      FIELD_ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      BCRYPT_ROUNDS: 4, // lower rounds for faster test execution
      LOCKOUT_THRESHOLD: 5,
      LOCKOUT_DURATION_MINUTES: 30
    };
  }

  return process.env;
};

const parsedConfig = configSchema.safeParse(getEnvOrFallback());

if (!parsedConfig.success) {
  console.error('❌ Invalid environment configuration:', JSON.stringify(parsedConfig.error.format(), null, 2));
  process.exit(1);
}

export const config = parsedConfig.data;
