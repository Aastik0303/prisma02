import { PrismaClient, User, RefreshToken, UserRole } from '@prisma/client';
import crypto from 'crypto';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { generateOpaqueToken, hashToken } from '../../utils/crypto.js';
import { sendEmail, sendVerificationEmail } from '../../utils/email.js';
import { logAuditEvent } from '../../utils/audit.js';
import { config } from '../../config/config.js';

// Base32 decoder for TOTP secret verification
function base32Decode(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = base32.replace(/=+$/, '').toUpperCase().replace(/\s/g, '');
  let bits = '';
  for (let i = 0; i < cleaned.length; i++) {
    const val = alphabet.indexOf(cleaned[i]);
    if (val === -1) throw new Error('Invalid base32 character');
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/**
 * Calculates standard HOTP (RFC 4226)
 */
function generateHotp(secretBuffer: Buffer, counter: number): string {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  
  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const hmacResult = hmac.digest();
  
  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  const code = ((hmacResult[offset] & 0x7f) << 24) |
               ((hmacResult[offset + 1] & 0xff) << 16) |
               ((hmacResult[offset + 2] & 0xff) << 8) |
               (hmacResult[offset + 3] & 0xff);
               
  return (code % 1000000).toString().padStart(6, '0');
}

/**
 * Verifies a standard TOTP (RFC 6238) code within a given window
 */
export function verifyTotp(secret: string, code: string, window: number = 1): boolean {
  try {
    const secretBuffer = base32Decode(secret);
    const timeStep = 30; // 30 seconds time step
    const currentCounter = Math.floor(Date.now() / 1000 / timeStep);
    
    // Check current step and surrounding steps within window (±1)
    for (let i = -window; i <= window; i++) {
      const calculated = generateHotp(secretBuffer, currentCounter + i);
      if (calculated === code) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export class AuthService {
  constructor(private prisma: PrismaClient, private redis: any) {}

  /**
   * Registers a new user, hashes password, generates verification token, queues welcome-verification email.
   */
  async registerUser(data: { fullName: string; email: string; password: string }) {
    // 1. Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existing) {
      throw { statusCode: 409, code: 'EMAIL_ALREADY_EXISTS', message: 'Email address is already registered' };
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(data.password);

    // 3. Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash: hashedPassword,
        role: 'student'
      }
    });

    // 4. Generate email verification token (32 random bytes)
    const verificationToken = generateOpaqueToken(32);
    const tokenHash = hashToken(verificationToken);

    await this.prisma.authToken.create({
      data: {
        userId: user.id,
        tokenHash,
        type: 'email_verification',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
      }
    });

    // 5. Send Email (via queue)
    const verificationLink = `${config.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(user.email, {
      fullName: user.fullName,
      verificationLink
    });

    // 6. Log audit event
    await logAuditEvent({
      userId: user.id,
      action: 'auth.register',
      metadata: { email: user.email }
    });

    return user.id;
  }

  /**
   * Helper to handle account lockout rules.
   */
  async handleFailedLoginAttempt(user: User, ip: string, userAgent: string) {
    const failedAttempts = user.failedAttempts + 1;
    let lockedUntil: Date | null = null;
    let action = 'auth.login.failed';

    if (failedAttempts >= 10) {
      lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours lock
      action = 'auth.account.locked';
      
      // Send notification email
      const unlockToken = generateOpaqueToken(32);
      const tokenHash = hashToken(unlockToken);
      await this.prisma.authToken.create({
        data: {
          userId: user.id,
          tokenHash,
          type: 'account_unlock',
          expiresAt: lockedUntil
        }
      });

      const unlockLink = `${config.FRONTEND_URL}/unlock-account?token=${unlockToken}`;
      await sendEmail(user.email, 'account_locked', {
        fullName: user.fullName,
        unlockLink
      });
    } else if (failedAttempts >= 5) {
      lockedUntil = new Date(Date.now() + config.LOCKOUT_DURATION_MINUTES * 60 * 1000); // 30 mins
      action = 'auth.account.locked';
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts,
        lockedUntil
      }
    });

    await logAuditEvent({
      userId: user.id,
      action,
      ipAddress: ip,
      userAgent,
      metadata: { failedAttempts, lockedUntil }
    });

    if (lockedUntil) {
      throw { 
        statusCode: 403, 
        code: 'ACCOUNT_LOCKED', 
        message: `Account locked due to multiple failed attempts. Try again later.` 
      };
    }
  }

  /**
   * Resets failed login attempts when login succeeds.
   */
  async resetFailedAttempts(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedAttempts: 0, lockedUntil: null }
    });
  }

  /**
   * Issue new session access token + refresh token family member.
   */
  async createSession(userId: string, familyId?: string, deviceInfo?: any) {
    const family = familyId || crypto.randomUUID();
    const refreshToken = generateOpaqueToken(32);
    const tokenHash = hashToken(refreshToken);

    const expiry = new Date(Date.now() + config.JWT_REFRESH_EXPIRY * 1000);

    // Save refresh token to database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        family,
        deviceInfo: deviceInfo || {},
        expiresAt: expiry
      }
    });

    return {
      refreshToken,
      family,
      expiresIn: config.JWT_ACCESS_EXPIRY
    };
  }

  /**
   * Handles rotation of refresh token and detection of token reuse (theft).
   */
  async rotateRefreshToken(token: string, deviceInfo?: any) {
    const hashed = hashToken(token);

    // Look up token
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashed },
      include: { user: true }
    });

    if (!tokenRecord) {
      throw { statusCode: 401, code: 'INVALID_TOKEN', message: 'Invalid refresh token' };
    }

    // Reuse detection
    if (tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      // Theft detected! Revoke the entire family
      await this.prisma.refreshToken.updateMany({
        where: { family: tokenRecord.family },
        data: {
          revoked: true,
          revokedReason: 'Token family compromised via reused token'
        }
      });

      // Send alert email to user
      await sendEmail(tokenRecord.user.email, 'suspicious_login', {
        fullName: tokenRecord.user.fullName,
        ip: deviceInfo?.ip || 'Unknown',
        userAgent: deviceInfo?.userAgent || 'Unknown'
      });

      await logAuditEvent({
        userId: tokenRecord.userId,
        action: 'auth.token.compromised',
        metadata: { family: tokenRecord.family }
      });

      throw { statusCode: 401, code: 'TOKEN_EXPIRED', message: 'Token has been revoked due to compromise detection' };
    }

    // Revoke the old token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        revoked: true,
        revokedAt: new Date(),
        revokedReason: 'Rotated'
      }
    });

    // Create new session in same family
    const session = await this.createSession(tokenRecord.userId, tokenRecord.family, deviceInfo);

    await logAuditEvent({
      userId: tokenRecord.userId,
      action: 'auth.token.refreshed',
      metadata: { family: tokenRecord.family }
    });

    return {
      user: tokenRecord.user,
      ...session
    };
  }

  /**
   * Revoke a refresh token.
   */
  async revokeSession(token: string) {
    const hashed = hashToken(token);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashed },
      data: {
        revoked: true,
        revokedAt: new Date(),
        revokedReason: 'Logout'
      }
    });
  }
}
