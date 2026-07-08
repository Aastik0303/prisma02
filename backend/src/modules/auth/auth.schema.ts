import { z } from 'zod';

// Helper to sanitize text (stripping basic HTML tags to prevent XSS)
const sanitizeString = (val: string) => {
  return val.replace(/<[^>]*>/g, '').trim();
};

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .transform(sanitizeString),
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address is too long')
    .transform(val => val.toLowerCase().trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
});

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address is too long')
    .transform(val => val.toLowerCase().trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  deviceFingerprint: z.string()
    .base64('Device fingerprint must be a valid base64-encoded string')
    .optional()
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .transform(val => val.toLowerCase().trim())
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
});

export const verifyPasswordResetOtpSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .transform(val => val.toLowerCase().trim()),
  code: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits')
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
});

export const verifyOtpSchema = z.object({
  mfaToken: z.string().uuid('Invalid MFA challenge token'),
  code: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
  type: z.enum(['totp', 'email_otp'])
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyPasswordResetOtpInput = z.infer<typeof verifyPasswordResetOtpSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
