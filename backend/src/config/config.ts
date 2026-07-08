import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  ALLOWED_ORIGINS: z.string().transform(val => val.split(',').map(o => o.trim())),
  DATABASE_URL: z.string().url(),
  DATABASE_REPLICA_URL: z.string().url().optional(),
  REDIS_URL: z.string(),
  JWT_PRIVATE_KEY: z.string().min(1, 'JWT_PRIVATE_KEY is required'),
  JWT_PUBLIC_KEY: z.string().min(1, 'JWT_PUBLIC_KEY is required'),
  JWT_ACCESS_EXPIRY: z.coerce.number().default(900),
  JWT_REFRESH_EXPIRY: z.coerce.number().default(604800),
  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET must be at least 32 characters'),
  RESEND_API_KEY: z.string().default('re_mock_key'),
  EMAIL_FROM: z.string().email().default('noreply@prismaembedded.codes'),
  EMAIL_PROVIDER: z.enum(['resend', 'smtp']).default('resend'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  BACKEND_URL: z.string().url().default('http://localhost:3001'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GROQ_API_KEY: z.string().trim().optional(),
  GROQ_API_KEY2: z.string().trim().optional(),
  GROQ_API_KEY3: z.string().trim().optional(),
  GROQ_API_KEYS: z.string().trim().optional().transform(val => (
    val ? val.split(',').map(key => key.trim()).filter(Boolean) : []
  )),
  GROQ_MODEL: z.string().trim().min(1).default('llama-3.3-70b-versatile'),
  HUGGINGFACE_API_KEY: z.string().trim().optional(),
  HUGGINGFACE_EMBEDDING_MODEL: z.string().trim().min(1).default('sentence-transformers/all-MiniLM-L6-v2'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_FULL_NAME: z.string().min(1).default('System Administrator'),
  FIELD_ENCRYPTION_KEY: z.string().regex(/^[a-fA-F0-9]{64}$/, 'FIELD_ENCRYPTION_KEY must be a 32-byte hex key (64 hex characters)'),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  LOCKOUT_THRESHOLD: z.coerce.number().default(5),
  LOCKOUT_DURATION_MINUTES: z.coerce.number().default(30)
});

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  throw new Error(`Invalid environment configuration: ${JSON.stringify(parsedConfig.error.format(), null, 2)}`);
}

export const config = parsedConfig.data;
