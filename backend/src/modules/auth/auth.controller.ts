import { FastifyReply, FastifyRequest } from 'fastify';
import crypto from 'crypto';
import { AuthService, verifyTotp } from './auth.service.js';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  verifyPasswordResetOtpSchema,
  verifyEmailSchema, 
  verifyOtpSchema 
} from './auth.schema.js';
import { config } from '../../config/config.js';
import { hashPassword, verifyPassword, validatePasswordStrength, isPasswordPwned } from '../../utils/password.js';
import { generateOpaqueToken, hashToken, generateNumericOtp } from '../../utils/crypto.js';
import { sendEmail, sendLoginNotification, sendWelcomeEmail } from '../../utils/email.js';
import { logAuditEvent } from '../../utils/audit.js';

const crossSiteCookieOptions = {
  secure: config.NODE_ENV === 'production',
  sameSite: config.NODE_ENV === 'production' ? 'none' as const : 'strict' as const
};

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = registerSchema.parse(request.body);

    const existingUser = await request.server.prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'User already exists. Please sign in with your registered email and password.'
      });
    }

    const strength = validatePasswordStrength(body.password, body.fullName, body.email);
    if (!strength.isValid) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'VALIDATION_ERROR',
        message: strength.message
      });
    }

    const userId = await this.authService.registerUser(body);
    return reply.status(201).send({
      message: 'Account created. Check your email to verify.',
      userId
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = loginSchema.parse(request.body);
    const ip = request.ip;
    const userAgent = request.headers['user-agent'] || 'Unknown';

    // 1. Find user (constant-time lookup check simulation)
    const user = await request.server.prisma.user.findUnique({
      where: { email: body.email }
    });

    // Timing attack prevention: always run verification check, even with dummy hash
    const dummyHash = '$argon2id$v=19$m=65536,t=3,p=4$dummyhashdummyhash';
    const isPasswordCorrect = await verifyPassword(body.password, user?.passwordHash || dummyHash);

    if (!user) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'USER_NOT_FOUND',
        message: 'User not found. Please sign up before signing in.'
      });
    }

    // 2. Check Lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        code: 'ACCOUNT_LOCKED',
        message: 'Your account is locked. Please check your email or try again later.'
      });
    }

    if (!isPasswordCorrect) {
      await this.authService.handleFailedLoginAttempt(user, ip, userAgent);
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        code: 'INVALID_PASSWORD',
        message: 'Incorrect password. Please check your password carefully.'
      });
    }

    // Reset failed attempts upon successful authentication
    await this.authService.resetFailedAttempts(user.id);

    // 3. MFA Check
    if (user.mfaEnabled) {
      const mfaToken = crypto.randomUUID();
      const mfaSession = {
        userId: user.id,
        attempts: 0,
        emailOtpCode: ''
      };

      const methods = ['totp'];

      // If user has verified email, they can also use email OTP
      if (user.emailVerified) {
        methods.push('email_otp');
        // Generate and store email OTP
        const otpCode = generateNumericOtp();
        mfaSession.emailOtpCode = otpCode;
        
        await sendEmail(user.email, 'suspicious_login', {
          fullName: user.fullName,
          ip,
          userAgent,
          customMessage: `Your MFA login verification code is: ${otpCode}. It expires in 5 minutes.`
        });
      }

      // Store MFA challenge context in Redis (5 min TTL)
      await request.server.redis.set(
        `mfa:${mfaToken}`,
        JSON.stringify(mfaSession),
        'EX',
        300
      );

      return reply.status(200).send({
        requiresMfa: true,
        mfaToken,
        methods
      });
    }

    // 4. Create standard session
    const session = await this.authService.createSession(user.id, undefined, { ip, userAgent });
    
    // Generate ES256 Access Token JWT
    const jti = crypto.randomUUID();
    const accessToken = await request.server.jwtService.signAccessToken(user.id, user.email, user.role, jti);

    // Set Refresh Token in HttpOnly cookie
    reply.setCookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      ...crossSiteCookieOptions,
      path: '/api/v1/auth',
      maxAge: config.JWT_REFRESH_EXPIRY
    });

    await logAuditEvent({
      userId: user.id,
      action: 'auth.login.success',
      ipAddress: ip,
      userAgent
    });

    const loginTime = new Date().toISOString();
    await request.server.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(loginTime), lastLoginIp: ip }
    });
    await sendLoginNotification(user.email, {
      fullName: user.fullName,
      loginTime,
      ip,
      userAgent
    });

    return reply.status(200).send({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      accessToken,
      expiresIn: session.expiresIn
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization!;
    const token = authHeader.substring(7);
    const payload = await request.server.jwtService.verifyAccessToken(token);

    // Blacklist access token JTI in Redis (remaining TTL)
    const remainingSeconds = Math.max(0, payload.exp! - Math.floor(Date.now() / 1000));
    if (remainingSeconds > 0) {
      await request.server.redis.set(`blacklist:jti:${payload.jti}`, '1', 'EX', remainingSeconds);
    }

    // Revoke Refresh Token from Cookie or request body fallback.
    const bodyRefreshToken = (request.body as any)?.refreshToken;
    const refreshToken = request.cookies?.refreshToken
      || (typeof bodyRefreshToken === 'string' ? bodyRefreshToken : undefined);

    if (refreshToken) {
      await this.authService.revokeSession(refreshToken);
    }

    // Clear client cookies
    reply.clearCookie('refreshToken', { path: '/api/v1/auth' });

    if (request.user) {
      await logAuditEvent({
        userId: request.user.id,
        action: 'auth.logout',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent']
      });
    }

    return reply.status(200).send({ message: 'Logged out successfully' });
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const bodyRefreshToken = (request.body as any)?.refreshToken;
    const refreshToken = request.cookies?.refreshToken
      || (typeof bodyRefreshToken === 'string' ? bodyRefreshToken : undefined);

    if (!refreshToken) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'VALIDATION_ERROR',
        message: 'Refresh token is missing'
      });
    }

    const ip = request.ip;
    const userAgent = request.headers['user-agent'] || 'Unknown';

    const session = await this.authService.rotateRefreshToken(refreshToken, { ip, userAgent });

    // Generate new Access Token JWT
    const jti = crypto.randomUUID();
    const accessToken = await request.server.jwtService.signAccessToken(
      session.user.id,
      session.user.email,
      session.user.role,
      jti
    );

    // Set rotated Refresh Token in cookie
    reply.setCookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      ...crossSiteCookieOptions,
      path: '/api/v1/auth',
      maxAge: config.JWT_REFRESH_EXPIRY
    });

    return reply.status(200).send({
      accessToken,
      expiresIn: session.expiresIn
    });
  }

  async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
    const { token } = verifyEmailSchema.parse(request.body || request.query);
    const hashed = hashToken(token);

    const tokenRecord = await request.server.prisma.authToken.findFirst({
      where: {
        tokenHash: hashed,
        type: 'email_verification',
        usedAt: null
      },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_TOKEN',
        message: 'Verification token is invalid or has expired'
      });
    }

    // Mark token as used
    await request.server.prisma.authToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date(), ipAddress: request.ip }
    });

    // Update user status
    await request.server.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailVerified: true }
    });

    // Send Welcome Email
    await sendWelcomeEmail(tokenRecord.user.email, {
      fullName: tokenRecord.user.fullName
    });

    await logAuditEvent({
      userId: tokenRecord.userId,
      action: 'auth.email.verified',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent']
    });

    return reply.status(200).send({ message: 'Email address verified successfully' });
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const { email } = forgotPasswordSchema.parse(request.body);

    const user = await request.server.prisma.user.findUnique({
      where: { email }
    });

    // Security: Always return 200 to prevent user enumeration
    if (!user) {
      return reply.status(200).send({
        message: 'If that email exists, a verification code has been sent.'
      });
    }

    await request.server.prisma.authToken.updateMany({
      where: {
        userId: user.id,
        type: 'password_reset',
        usedAt: null
      },
      data: { usedAt: new Date(), ipAddress: request.ip }
    });

    const otpCode = generateNumericOtp();
    const tokenHash = hashToken(`password-reset-otp:${email}:${otpCode}`);

    await request.server.prisma.authToken.create({
      data: {
        userId: user.id,
        tokenHash,
        type: 'password_reset',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        ipAddress: request.ip
      }
    });

    await sendEmail(user.email, 'password_reset_otp', {
      fullName: user.fullName,
      otpCode
    });

    await logAuditEvent({
      userId: user.id,
      action: 'auth.password.reset_requested',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent']
    });

    return reply.status(200).send({
      message: 'If that email exists, a verification code has been sent.'
    });
  }

  async verifyPasswordResetOtp(request: FastifyRequest, reply: FastifyReply) {
    const { email, code } = verifyPasswordResetOtpSchema.parse(request.body);
    const otpHash = hashToken(`password-reset-otp:${email}:${code}`);

    const tokenRecord = await request.server.prisma.authToken.findFirst({
      where: {
        tokenHash: otpHash,
        type: 'password_reset',
        usedAt: null
      },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date() || tokenRecord.user.email !== email) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_OTP',
        message: 'Verification code is invalid or has expired'
      });
    }

    await request.server.prisma.authToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date(), ipAddress: request.ip }
    });

    const resetToken = generateOpaqueToken(32);
    await request.server.prisma.authToken.create({
      data: {
        userId: tokenRecord.userId,
        tokenHash: hashToken(resetToken),
        type: 'password_reset',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        ipAddress: request.ip
      }
    });

    await logAuditEvent({
      userId: tokenRecord.userId,
      action: 'auth.password.reset_otp_verified',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent']
    });

    return reply.status(200).send({
      message: 'Verification code accepted',
      resetToken
    });
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const body = resetPasswordSchema.parse(request.body);
    const hashedToken = hashToken(body.token);

    const tokenRecord = await request.server.prisma.authToken.findFirst({
      where: {
        tokenHash: hashedToken,
        type: 'password_reset',
        usedAt: null
      },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_TOKEN',
        message: 'Reset token is invalid or has expired'
      });
    }

    // Validate strength and Pwned Passwords leak check
    const strength = validatePasswordStrength(body.password, tokenRecord.user.fullName, tokenRecord.user.email);
    if (!strength.isValid) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'VALIDATION_ERROR',
        message: strength.message
      });
    }

    const isLeaked = await isPasswordPwned(body.password);
    if (isLeaked) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'VALIDATION_ERROR',
        message: 'This password has been exposed in a data breach. Please choose a different password.'
      });
    }

    const hashedPassword = await hashPassword(body.password);

    // Update password & reset login locks
    await request.server.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: {
        passwordHash: hashedPassword,
        failedAttempts: 0,
        lockedUntil: null
      }
    });

    // Mark token as used
    await request.server.prisma.authToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date(), ipAddress: request.ip }
    });

    // Revoke all existing sessions for this user (force logout everywhere)
    await request.server.prisma.refreshToken.updateMany({
      where: { userId: tokenRecord.userId },
      data: {
        revoked: true,
        revokedReason: 'Password Reset'
      }
    });

    await logAuditEvent({
      userId: tokenRecord.userId,
      action: 'auth.password.changed',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent']
    });

    return reply.status(200).send({ message: 'Password has been reset successfully' });
  }

  async verifyOtp(request: FastifyRequest, reply: FastifyReply) {
    const { mfaToken, code, type } = verifyOtpSchema.parse(request.body);
    const ip = request.ip;
    const userAgent = request.headers['user-agent'] || 'Unknown';

    // 1. Get MFA Challenge session from Redis
    const redisKey = `mfa:${mfaToken}`;
    const sessionData = await request.server.redis.get(redisKey);

    if (!sessionData) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_TOKEN',
        message: 'MFA challenge has expired or is invalid'
      });
    }

    const mfaSession = JSON.parse(sessionData);
    
    // Load User
    const user = await request.server.prisma.user.findUnique({
      where: { id: mfaSession.userId }
    });

    if (!user) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }

    let isValid = false;

    if (type === 'totp') {
      if (!user.mfaSecret) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVALID_OTP',
          message: 'TOTP is not configured for this user'
        });
      }
      // Replay prevention: verify OTP has not already been used in this window
      const replayKey = `otp_used:${user.id}:${code}`;
      const hasBeenUsed = await request.server.redis.exists(replayKey);

      if (hasBeenUsed) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          code: 'INVALID_OTP',
          message: 'OTP has already been used'
        });
      }

      isValid = verifyTotp(user.mfaSecret, code);

      if (isValid) {
        // Prevent replay for next 60 seconds
        await request.server.redis.set(replayKey, '1', 'EX', 60);
      }
    } else if (type === 'email_otp') {
      isValid = mfaSession.emailOtpCode === code;
    }

    if (!isValid) {
      // Increment attempt counter
      mfaSession.attempts += 1;

      if (mfaSession.attempts >= 5) {
        // Delete challenge and lock account
        await request.server.redis.del(redisKey);
        await this.authService.handleFailedLoginAttempt(user, ip, userAgent);
        
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          code: 'ACCOUNT_LOCKED',
          message: 'Too many failed attempts. Account has been locked.'
        });
      }

      // Update session with new attempts count
      await request.server.redis.set(redisKey, JSON.stringify(mfaSession), 'EX', 300);

      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_OTP',
        message: 'Invalid OTP code. Remaining attempts: ' + (5 - mfaSession.attempts)
      });
    }

    // OTP Verified! Delete challenge
    await request.server.redis.del(redisKey);

    // Create session tokens
    const session = await this.authService.createSession(user.id, undefined, { ip, userAgent });

    const jti = crypto.randomUUID();
    const accessToken = await request.server.jwtService.signAccessToken(
      user.id,
      user.email,
      user.role,
      jti
    );

    // Set Refresh Token in cookie
    reply.setCookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      ...crossSiteCookieOptions,
      path: '/api/v1/auth',
      maxAge: config.JWT_REFRESH_EXPIRY
    });

    await logAuditEvent({
      userId: user.id,
      action: 'auth.login.success',
      ipAddress: ip,
      userAgent,
      metadata: { mfaVerified: true, mfaType: type }
    });

    const loginTime = new Date().toISOString();
    await request.server.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(loginTime), lastLoginIp: ip }
    });
    await sendLoginNotification(user.email, {
      fullName: user.fullName,
      loginTime,
      ip,
      userAgent
    });

    return reply.status(200).send({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      accessToken,
      expiresIn: session.expiresIn
    });
  }

  async getCsrfToken(request: FastifyRequest, reply: FastifyReply) {
    const sessionId = request.csrfSessionId;
    
    // Generate new CSRF token
    const csrfToken = crypto.randomBytes(32).toString('hex');

    // Store tokens independently so concurrent mobile requests do not invalidate
    // each other by rotating a single session-wide token.
    await Promise.all([
      request.server.redis.set(`csrf:${sessionId}:${csrfToken}`, '1', 'EX', 900),
      request.server.redis.set(`csrf:${sessionId}`, csrfToken, 'EX', 900)
    ]);

    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');

    // Set session cookie
    reply.setCookie('csrf_session_id', sessionId, {
      httpOnly: true,
      ...crossSiteCookieOptions,
      path: '/',
      maxAge: 900
    });

    // Set double submit cookie
    reply.setCookie('csrf_token', csrfToken, {
      ...crossSiteCookieOptions,
      path: '/',
      maxAge: 900
    });

    return reply.status(200).send({ csrfToken, csrfSessionId: sessionId });
  }
}
