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

    app.prisma.user.findMany = vi.fn().mockImplementation(async (args: any) => {
      if (!args?.select?._count) return mockUsers;
      return mockUsers.map(user => ({
        ...user,
        passwordHash: user.passwordHash || null,
        metadata: user.metadata || {},
        lastLoginAt: user.lastLoginAt || null,
        lastLoginIp: user.lastLoginIp || null,
        avatarUrl: user.avatarUrl || null,
        refreshTokens: [],
        auditLogs: [],
        _count: {
          refreshTokens: 0,
          authTokens: 0,
          auditLogs: 0,
          teamMemberships: 0,
          ownedProjects: 0,
          assignedTasks: 0,
          sentMessages: 0,
          receivedMessages: 0
        }
      }));
    });
    app.prisma.user.count = vi.fn().mockImplementation(async (args: any) => {
      if (args?.where?.emailVerified === true) return mockUsers.filter(user => user.emailVerified).length;
      if (args?.where?.mfaEnabled === true) return mockUsers.filter(user => user.mfaEnabled).length;
      if (args?.where?.lockedUntil) return mockUsers.filter(user => user.lockedUntil && user.lockedUntil > new Date()).length;
      return mockUsers.length;
    });

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
    app.prisma.auditLog.findMany = vi.fn().mockResolvedValue([]);

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
      expect(response.body).not.toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('test@example.com');
      
      // Cookie is set
      const cookies = response.headers['set-cookie'] || [];
      expect(cookies.some((c: string) => c.includes('refreshToken='))).toBe(true);
      expect(sentEmailsTestBox.some(email => email.type === 'login_notification')).toBe(true);
      expect(mockUsers[0].lastLoginAt).toBeInstanceOf(Date);
    });

    it('should allow login before the email address is verified', async () => {
      mockUsers[0].emailVerified = false;
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
      expect(response.body.user.email).toBe('test@example.com');
      expect(mockRefreshTokens).toHaveLength(1);
      expect(mockUsers[0].emailVerified).toBe(false);
      expect(sentEmailsTestBox.some(email => email.type === 'login_notification')).toBe(true);
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
      expect(csrfResponse.headers['cache-control']).toContain('no-store');
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

    it('should validate CSRF using X-CSRF-Session-Id when the cookie is unavailable', async () => {
      const csrfResponse = await request(serverInstance)
        .get('/api/v1/auth/csrf-token');

      expect(csrfResponse.status).toBe(200);

      const regResponse = await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('x-csrf-token', csrfResponse.body.csrfToken)
        .set('x-csrf-session-id', csrfResponse.body.csrfSessionId)
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      expect(regResponse.status).toBe(201);
    });

    it('should prefer X-CSRF-Session-Id over a stale csrf_session_id cookie', async () => {
      const staleCookie = 'csrf_session_id=stale-mobile-session; Path=/';
      const csrfResponse = await request(serverInstance)
        .get('/api/v1/auth/csrf-token');

      expect(csrfResponse.status).toBe(200);

      const regResponse = await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('Cookie', staleCookie)
        .set('x-csrf-token', csrfResponse.body.csrfToken)
        .set('x-csrf-session-id', csrfResponse.body.csrfSessionId)
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      expect(regResponse.status).toBe(201);
    });

    it('should keep earlier CSRF tokens valid when another token is issued for the same session', async () => {
      const firstCsrfResponse = await request(serverInstance)
        .get('/api/v1/auth/csrf-token');

      const secondCsrfResponse = await request(serverInstance)
        .get('/api/v1/auth/csrf-token')
        .set('x-csrf-session-id', firstCsrfResponse.body.csrfSessionId);

      expect(secondCsrfResponse.status).toBe(200);
      expect(secondCsrfResponse.body.csrfToken).not.toBe(firstCsrfResponse.body.csrfToken);

      const regResponse = await request(serverInstance)
        .post('/api/v1/auth/register')
        .set('x-csrf-token', firstCsrfResponse.body.csrfToken)
        .set('x-csrf-session-id', firstCsrfResponse.body.csrfSessionId)
        .send({
          fullName: 'Aarav Sharma',
          email: 'aarav@example.com',
          password: 'StrongPassword123!'
        });

      expect(regResponse.status).toBe(201);
    });
  });

  describe('POST /api/v1/contact/request', () => {
    it('should validate and dispatch a contact request email', async () => {
      const { csrfToken, sessionCookie } = await getCsrfContext();
      const response = await request(serverInstance)
        .post('/api/v1/contact/request')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          name: 'Aarav Sharma',
          email: 'aarav@example.com',
          message: 'I would like to discuss a business partnership.',
          website: ''
        });

      expect(response.status).toBe(202);
      expect(sentEmailsTestBox.some(email => (
        email.type === 'contact_request'
        && email.to === 'admin@example.com'
        && email.replyTo === 'aarav@example.com'
      ))).toBe(true);
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

      const firstRefreshCookie = (loginRes.headers['set-cookie'] || [])
        .find((cookie: string) => cookie.startsWith('refreshToken='))
        ?.split(';')[0];
      expect(firstRefreshCookie).toBeTruthy();
      
      // 2. First Refresh (rotates tokens successfully)
      const refreshRes = await request(serverInstance)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [sessionCookie, firstRefreshCookie!])
        .set('x-csrf-token', csrfToken)
        .send({});

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body).toHaveProperty('accessToken');
      
      expect(refreshRes.body).not.toHaveProperty('refreshToken');
      const secondRefreshCookie = (refreshRes.headers['set-cookie'] || [])
        .find((cookie: string) => cookie.startsWith('refreshToken='))
        ?.split(';')[0];
      expect(secondRefreshCookie).toBeTruthy();
      expect(secondRefreshCookie).not.toBe(firstRefreshCookie);

      // 3. Reuse old refresh token (theft detection)
      const reuseRes = await request(serverInstance)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [sessionCookie, firstRefreshCookie!])
        .set('x-csrf-token', csrfToken)
        .send({});

      expect(reuseRes.status).toBe(401);
      expect(reuseRes.body.code).toBe('TOKEN_EXPIRED');

      // 4. Verify new token has also been revoked as family was invalidated
      const siblingRes = await request(serverInstance)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [sessionCookie, secondRefreshCookie!])
        .set('x-csrf-token', csrfToken)
        .send({});

      expect(siblingRes.status).toBe(401);
      
      // Check suspicious login email was dispatched
      expect(sentEmailsTestBox.some(e => e.type === 'suspicious_login')).toBe(true);
    });

    it('should rotate using request body fallback when the refresh cookie is unavailable', async () => {
      const loginRes = await request(serverInstance)
        .post('/api/v1/auth/login')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      const refreshToken = (loginRes.headers['set-cookie'] || [])
        .find((cookie: string) => cookie.startsWith('refreshToken='))
        ?.split(';')[0]
        ?.replace(/^refreshToken=/, '');

      expect(refreshToken).toBeTruthy();

      const refreshRes = await request(serverInstance)
        .post('/api/v1/auth/refresh')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({ refreshToken });

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body).toHaveProperty('accessToken');
      expect((refreshRes.headers['set-cookie'] || []).some((cookie: string) => cookie.startsWith('refreshToken='))).toBe(true);
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
      expect(adminAccess.body.users).toBeInstanceOf(Array);
      expect(adminAccess.body.users).toHaveLength(2);
    });
  });
});
