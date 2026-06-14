import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { buildApp } from '../src/app.js';
import { hashPassword } from '../src/utils/password.js';
import { hashToken } from '../src/utils/crypto.js';
import { sentEmailsTestBox } from '../src/utils/email.js';

// In-Memory Database state simulation
let mockUsers: any[] = [];
let mockRefreshTokens: any[] = [];
let mockAuthTokens: any[] = [];
let mockAuditLogs: any[] = [];

describe('Authentication & Authorization System API Tests', () => {
  let app: any;
  let serverInstance: any;

  const getCsrfContext = async () => {
    const csrfResponse = await request(serverInstance).get('/api/v1/auth/csrf-token');
    const cookies = csrfResponse.headers['set-cookie'] || [];

    return {
      csrfToken: csrfResponse.body.csrfToken,
      sessionCookie: cookies.find((cookie: string) => cookie.startsWith('csrf_session_id='))
    };
  };

  beforeEach(async () => {
    // Clear databases
    mockUsers = [];
    mockRefreshTokens = [];
    mockAuthTokens = [];
    mockAuditLogs = [];
    sentEmailsTestBox.length = 0;

    // Build fresh app instance
    app = await buildApp();
    await app.ready();
    serverInstance = app.server;

    // Inject in-memory database mocks into Prisma Client
    app.prisma.user.findUnique = vi.fn().mockImplementation(async (args: any) => {
      const { where } = args;
      if (where.email) return mockUsers.find(u => u.email === where.email) || null;
      if (where.id) return mockUsers.find(u => u.id === where.id) || null;
      return null;
    });

    app.prisma.user.create = vi.fn().mockImplementation(async (args: any) => {
      const { data } = args;
      const newUser = {
        id: crypto.randomUUID(),
        emailVerified: false,
        role: 'student',
        failedAttempts: 0,
        lockedUntil: null,
        mfaEnabled: false,
        mfaSecret: null,
        mfaRecoveryCodes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };
      mockUsers.push(newUser);
      return newUser;
    });

    app.prisma.user.findMany = vi.fn().mockImplementation(async () => mockUsers);

    app.prisma.user.update = vi.fn().mockImplementation(async (args: any) => {
      const { where, data } = args;
      const user = mockUsers.find(u => u.id === where.id || u.email === where.email);
      if (!user) throw new Error('User not found');
      
      Object.keys(data).forEach(key => {
        user[key] = data[key];
      });
      return user;
    });

    app.prisma.authToken.create = vi.fn().mockImplementation(async (args: any) => {
      const { data } = args;
      const newToken = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        usedAt: null,
        ...data
      };
      mockAuthTokens.push(newToken);
      return newToken;
    });

    app.prisma.authToken.findFirst = vi.fn().mockImplementation(async (args: any) => {
      const { where } = args;
      const token = mockAuthTokens.find(t => {
        return t.tokenHash === where.tokenHash &&
               t.type === where.type &&
               t.usedAt === (where.usedAt === null ? null : undefined);
      });
      if (token) {
        // Mock relation loading
        token.user = mockUsers.find(u => u.id === token.userId);
      }
      return token || null;
    });

    app.prisma.authToken.update = vi.fn().mockImplementation(async (args: any) => {
      const { where, data } = args;
      const token = mockAuthTokens.find(t => t.id === where.id);
      if (!token) throw new Error('Token not found');
      Object.keys(data).forEach(key => {
        token[key] = data[key];
      });
      return token;
    });

    app.prisma.refreshToken.create = vi.fn().mockImplementation(async (args: any) => {
      const { data } = args;
      const newRefToken = {
        id: crypto.randomUUID(),
        revoked: false,
        revokedAt: null,
        revokedReason: null,
        createdAt: new Date(),
        ...data
      };
      mockRefreshTokens.push(newRefToken);
      return newRefToken;
    });

    app.prisma.refreshToken.findUnique = vi.fn().mockImplementation(async (args: any) => {
      const { where } = args;
      const refToken = mockRefreshTokens.find(t => t.tokenHash === where.tokenHash);
      if (refToken) {
        refToken.user = mockUsers.find(u => u.id === refToken.userId);
      }
      return refToken || null;
    });

    app.prisma.refreshToken.update = vi.fn().mockImplementation(async (args: any) => {
      const { where, data } = args;
      const refToken = mockRefreshTokens.find(t => t.id === where.id);
      if (!refToken) throw new Error('Token not found');
      Object.keys(data).forEach(key => {
        refToken[key] = data[key];
      });
      return refToken;
    });

    app.prisma.refreshToken.updateMany = vi.fn().mockImplementation(async (args: any) => {
      const { where, data } = args;
      const tokens = mockRefreshTokens.filter(t => t.family === where.family || t.userId === where.userId);
      tokens.forEach(t => {
        Object.keys(data).forEach(key => {
          t[key] = data[key];
        });
      });
      return { count: tokens.length };
    });

    app.prisma.auditLog.create = vi.fn().mockImplementation(async (args: any) => {
      const { data } = args;
      const newLog = {
        id: BigInt(mockAuditLogs.length + 1),
        createdAt: new Date(),
        ...data
      };
      mockAuditLogs.push(newLog);
      return newLog;
    });

    // Make transaction calls resolve smoothly
    app.prisma.$transaction = vi.fn().mockImplementation(async (cb: any) => {
      return await cb(app.prisma);
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /', () => {
    it('should return a healthy API status response for the root path', async () => {
      const response = await request(serverInstance)
        .get('/');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'ok',
        service: 'prisma-embedded-codes-backend'
      });
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully and dispatch verification email', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();
      const response = await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId');
      expect(response.body.message).toContain('Account created');
      
      expect(mockUsers).toHaveLength(1);
      expect(mockUsers[0].email).toBe('aarav@example.com');
      
      // Verification email checked
      expect(sentEmailsTestBox).toHaveLength(1);
      expect(sentEmailsTestBox[0].to).toBe('aarav@example.com');
      expect(sentEmailsTestBox[0].type).toBe('verification');
    });

    it('should fail registration for weak/short password', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();
      const response = await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('at least 8 characters');
    });

    it('should prevent duplicate email registration', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();

      // Register first user
      await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      // Register second user with same email
      const response = await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          fullName: 'Aarav Sharma Copy',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      expect(response.status).toBe(409);
      expect(response.body.code).toBe('EMAIL_ALREADY_EXISTS');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Seed a user in the database
      const hash = await hashPassword('Password123!');
      mockUsers.push({
        id: 'user-1-uuid',
        fullName: 'Test User',
        email: 'test@example.com',
        passwordHash: hash,
        emailVerified: true,
        role: 'student',
        failedAttempts: 0,
        lockedUntil: null,
        mfaEnabled: false,
        mfaSecret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    it('should authenticate successfully with correct credentials', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();
      const response = await request(serverInstance)
        .post('/api/v1/auth/login')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('test@example.com');
      
      // Cookie is set
      const cookies = response.headers['set-cookie'] || [];
      expect(cookies.some((c: string) => c.includes('refreshToken='))).toBe(true);
    });

    it('should fail with an incorrect password', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();
      const response = await request(serverInstance)
        .post('/api/v1/auth/login')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!'
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_PASSWORD');
      expect(response.body.message).toContain('Incorrect password');
    });

    it('should fail when the user is not registered', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();
      const response = await request(serverInstance)
        .post('/api/v1/auth/login')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'missing@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(404);
      expect(response.body.code).toBe('USER_NOT_FOUND');
      expect(response.body.message).toContain('User not found');
    });

    it('should lock user out after 5 consecutive failures', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();

      // Run 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        const res = await request(serverInstance)
          .post('/api/v1/auth/login')
          .set('Cookie', sessionCookie)
          .set('x-csrf-token', csrfToken)
          .send({
            email: 'test@example.com',
            password: 'WrongPassword!'
          });
        
        if (i < 4) {
          expect(res.status).toBe(401);
        } else {
          // The 5th failed attempt triggers the lockout
          expect(res.status).toBe(403);
          expect(res.body.code).toBe('ACCOUNT_LOCKED');
        }
      }

      // Check database state
      const user = mockUsers[0];
      expect(user.failedAttempts).toBe(5);
      expect(user.lockedUntil).not.toBeNull();
      expect(new Date(user.lockedUntil).getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('CSRF Validation', () => {
    it('should require CSRF validation on mutating endpoints (POST)', async () => {
      // Mutating call without X-CSRF-Token header
      const response = await request(serverInstance)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('INVALID_CSRF_TOKEN');
      expect(response.body.message).toContain('CSRF token is missing');
    });

    it('should bypass CSRF if valid X-CSRF-Token is retrieved and passed', async () => {
      // 1. Fetch CSRF token
      const csrfResponse = await request(serverInstance)
        .get('/api/v1/auth/csrf-token');

      expect(csrfResponse.status).toBe(200);
      const csrfToken = csrfResponse.body.csrfToken;
      
      // Extract csrf session id cookie
      const cookies = csrfResponse.headers['set-cookie'];
      const sessionCookie = cookies.find((c: string) => c.startsWith('csrf_session_id='));

      // 2. Perform mutating request with CSRF token header and session cookie
      const regResponse = await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      expect(regResponse.status).toBe(201);
    });
  });

  describe('Refresh Token Rotation (RTR)', () => {
    let csrfToken: string;
    let sessionCookie: string;

    beforeEach(async () => {
      const hash = await hashPassword('Password123!');
      mockUsers.push({
        id: 'user-1-uuid',
        fullName: 'Test User',
        email: 'test@example.com',
        passwordHash: hash,
        emailVerified: true,
        role: 'student',
        failedAttempts: 0,
        lockedUntil: null,
        mfaEnabled: false,
        mfaSecret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Get CSRF details
      const csrfResponse = await request(serverInstance).get('/api/v1/auth/csrf-token');
      csrfToken = csrfResponse.body.csrfToken;
      sessionCookie = csrfResponse.headers['set-cookie'].find((c: string) => c.startsWith('csrf_session_id='));
    });

    it('should rotate tokens and invalidate old token family on reuse', async () => {
      // 1. Login to get token
      const loginRes = await request(serverInstance)
        .post('/api/v1/auth/login')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      const firstRefreshToken = loginRes.body.refreshToken;
      
      // 2. First Refresh (rotates tokens successfully)
      const refreshRes = await request(serverInstance)
        .post('/api/v1/auth/refresh')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          refreshToken: firstRefreshToken
        });

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body).toHaveProperty('accessToken');
      
      const secondRefreshToken = refreshRes.body.refreshToken;
      expect(secondRefreshToken).not.toBe(firstRefreshToken);

      // 3. Reuse old refresh token (theft detection)
      const reuseRes = await request(serverInstance)
        .post('/api/v1/auth/refresh')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          refreshToken: firstRefreshToken
        });

      expect(reuseRes.status).toBe(401);
      expect(reuseRes.body.code).toBe('TOKEN_EXPIRED');

      // 4. Verify new token has also been revoked as family was invalidated
      const siblingRes = await request(serverInstance)
        .post('/api/v1/auth/refresh')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          refreshToken: secondRefreshToken
        });

      expect(siblingRes.status).toBe(401);
      
      // Check suspicious login email was dispatched
      expect(sentEmailsTestBox.some(e => e.type === 'suspicious_login')).toBe(true);
    });
  });

  describe('RBAC Authorization', () => {
    let csrfToken: string;
    let sessionCookie: string;

    beforeEach(async () => {
      const hash = await hashPassword('Password123!');
      
      // Create student
      mockUsers.push({
        id: 'student-uuid',
        fullName: 'Student User',
        email: 'student@example.com',
        passwordHash: hash,
        emailVerified: true,
        role: 'student',
        failedAttempts: 0,
        lockedUntil: null,
        mfaEnabled: false,
        mfaSecret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create admin
      mockUsers.push({
        id: 'admin-uuid',
        fullName: 'Admin User',
        email: 'admin@example.com',
        passwordHash: hash,
        emailVerified: true,
        role: 'admin',
        failedAttempts: 0,
        lockedUntil: null,
        mfaEnabled: false,
        mfaSecret: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Get CSRF details
      const csrfResponse = await request(serverInstance).get('/api/v1/auth/csrf-token');
      csrfToken = csrfResponse.body.csrfToken;
      sessionCookie = csrfResponse.headers['set-cookie'].find((c: string) => c.startsWith('csrf_session_id='));
    });

    it('should restrict admin route to admin role users only', async () => {
      // 1. Login as Student
      const studentLogin = await request(serverInstance)
        .post('/api/v1/auth/login')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'student@example.com',
          password: 'Password123!'
        });

      const studentJwt = studentLogin.body.accessToken;

      // Access admin endpoint with student token
      const studentAccess = await request(serverInstance)
        .get('/api/v1/users/admin/users')
        .set('Authorization', `Bearer ${studentJwt}`);

      expect(studentAccess.status).toBe(403);
      expect(studentAccess.body.code).toBe('FORBIDDEN');

      // 2. Login as Admin
      const adminLogin = await request(serverInstance)
        .post('/api/v1/auth/login')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'admin@example.com',
          password: 'Password123!'
        });

      const adminJwt = adminLogin.body.accessToken;

      // Access admin endpoint with admin token
      const adminAccess = await request(serverInstance)
        .get('/api/v1/users/admin/users')
        .set('Authorization', `Bearer ${adminJwt}`);

      expect(adminAccess.status).toBe(200);
      expect(adminAccess.body).toBeInstanceOf(Array);
      expect(adminAccess.body).toHaveLength(2); // returns both seeded users
    });
  });
});
