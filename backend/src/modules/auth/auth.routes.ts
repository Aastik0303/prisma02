import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller.js';
import { requireAuth } from './auth.middleware.js';
import { 
  loginIpRateLimit,
  loginEmailRateLimit,
  registerIpRateLimit,
  forgotPasswordRateLimit,
  verifyOtpRateLimit,
  csrfTokenRateLimit
} from '../../plugins/rateLimit.js';
import { encrypt } from '../../utils/crypto.js';
import { logAuditEvent } from '../../utils/audit.js';
import { config } from '../../config/config.js';

const requireDeveloperEmail = async (request: any, reply: any) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  if (!email || !config.DEVELOPER_EMAILS.includes(email)) {
    return reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      code: 'DEVELOPER_EMAIL_REQUIRED',
      message: 'This email is not approved for developer access.'
    });
  }
};

const crossSiteCookieOptions = (fastify: FastifyInstance) => ({
  secure: fastify.config.NODE_ENV === 'production',
  sameSite: fastify.config.NODE_ENV === 'production' ? 'none' as const : 'strict' as const
});

export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController(fastify.authService);

  // POST /api/v1/auth/register
  fastify.post('/register', {
    config: {
      rateLimit: registerIpRateLimit
    }
  }, authController.register.bind(authController));

  fastify.post('/developer-register', {
    preHandler: [requireDeveloperEmail],
    config: { rateLimit: registerIpRateLimit }
  }, authController.register.bind(authController));

  // POST /api/v1/auth/login
  fastify.post('/login', {
    config: {
      // Run both IP and Email rate limiting checks
      rateLimit: loginIpRateLimit
    }
  }, authController.login.bind(authController));

  fastify.post('/developer-login', {
    preHandler: [requireDeveloperEmail],
    config: { rateLimit: loginIpRateLimit }
  }, authController.login.bind(authController));

  // POST /api/v1/auth/logout
  fastify.post('/logout', {
    preHandler: [requireAuth]
  }, authController.logout.bind(authController));

  // POST /api/v1/auth/refresh
  fastify.post('/refresh', authController.refresh.bind(authController));

  // POST /api/v1/auth/verify-email
  fastify.post('/verify-email', authController.verifyEmail.bind(authController));
  fastify.get('/verify-email', authController.verifyEmail.bind(authController)); // support GET link verification

  // POST /api/v1/auth/forgot-password
  fastify.post('/forgot-password', {
    config: {
      rateLimit: forgotPasswordRateLimit
    }
  }, authController.forgotPassword.bind(authController));

  // POST /api/v1/auth/verify-password-reset-otp
  fastify.post('/verify-password-reset-otp', {
    config: {
      rateLimit: verifyOtpRateLimit
    }
  }, authController.verifyPasswordResetOtp.bind(authController));

  // POST /api/v1/auth/reset-password
  fastify.post('/reset-password', authController.resetPassword.bind(authController));

  // POST /api/v1/auth/verify-otp
  fastify.post('/verify-otp', {
    config: {
      rateLimit: verifyOtpRateLimit
    }
  }, authController.verifyOtp.bind(authController));

  // GET /api/v1/auth/csrf-token
  fastify.get('/csrf-token', {
    config: {
      rateLimit: csrfTokenRateLimit
    }
  }, authController.getCsrfToken.bind(authController));

  // Register OAuth Callbacks if plugins are registered
  // Google Callback
  fastify.get('/oauth/google/callback', async (request: any, reply) => {
    try {
      const tokenResponse = await (fastify as any).googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
      const accessToken = tokenResponse.token.access_token;
      
      // Fetch user profile from Google API
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile from Google');
      }

      const profile = await profileResponse.json() as {
        id: string;
        email: string;
        name?: string;
        picture?: string;
      };
      
      const email = profile.email.toLowerCase().trim();
      const providerId = profile.id;
      const fullName = profile.name || email.split('@')[0];
      const avatarUrl = profile.picture || null;

      // Upsert User and OAuthAccount in a transaction
      const user = await fastify.prisma.$transaction(async (tx) => {
        let dbUser = await tx.user.findUnique({ where: { email } });

        if (!dbUser) {
          dbUser = await tx.user.create({
            data: {
              email,
              fullName,
              avatarUrl,
              emailVerified: true
            }
          });
        }

        const oauthEncryptedAccess = encrypt(accessToken);
        const oauthEncryptedRefresh = tokenResponse.token.refresh_token ? encrypt(tokenResponse.token.refresh_token) : null;
        
        await tx.oAuthAccount.upsert({
          where: { provider_providerId: { provider: 'google', providerId } },
          update: {
            accessToken: oauthEncryptedAccess,
            refreshToken: oauthEncryptedRefresh,
            expiresAt: tokenResponse.token.expires_at ? new Date(tokenResponse.token.expires_at) : null
          },
          create: {
            userId: dbUser.id,
            provider: 'google',
            providerId,
            accessToken: oauthEncryptedAccess,
            refreshToken: oauthEncryptedRefresh,
            expiresAt: tokenResponse.token.expires_at ? new Date(tokenResponse.token.expires_at) : null
          }
        });

        return dbUser;
      });

      // Create session
      const session = await fastify.authService.createSession(user.id, undefined, {
        ip: request.ip,
        userAgent: request.headers['user-agent']
      });

      // Set cookie
      reply.setCookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        ...crossSiteCookieOptions(fastify),
        path: '/api/v1/auth',
        maxAge: fastify.config.JWT_REFRESH_EXPIRY
      });

      await logAuditEvent({
        userId: user.id,
        action: 'auth.oauth.connected',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: { provider: 'google' }
      });

      // The refresh token stays in the HttpOnly cookie. The frontend exchanges
      // that cookie for a short-lived access token after this safe redirect.
      const redirectUrl = `${fastify.config.ALLOWED_ORIGINS[0]}/dashboard?oauth=success`;
      return reply.redirect(redirectUrl);

    } catch (err: any) {
      fastify.log.error(err);
      return reply.redirect(`${fastify.config.ALLOWED_ORIGINS[0]}/login?error=oauth_failed`);
    }
  });

  // GitHub Callback
  fastify.get('/oauth/github/callback', async (request: any, reply) => {
    try {
      const tokenResponse = await (fastify as any).githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
      const accessToken = tokenResponse.token.access_token;
      
      // Fetch user profile from GitHub API
      const profileResponse = await fetch('https://api.github.com/user', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'Prisma-Embedded-Codes-Backend'
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile from GitHub');
      }

      const profile = await profileResponse.json() as {
        id: string | number;
        login?: string;
        email?: string | null;
        name?: string | null;
        avatar_url?: string | null;
      };
      
      let email = profile.email;

      // If email is private on GitHub, fetch user email list
      if (!email) {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'Prisma-Embedded-Codes-Backend'
          }
        });
        if (emailsResponse.ok) {
          const emails = await emailsResponse.json() as Array<{
            email: string;
            primary?: boolean;
            verified?: boolean;
          }>;
          const primaryEmail = emails.find((e: any) => e.primary && e.verified);
          email = primaryEmail ? primaryEmail.email : emails[0]?.email;
        }
      }

      if (!email) {
        throw new Error('No verified email address found in GitHub profile');
      }

      email = email.toLowerCase().trim();
      const providerId = String(profile.id);
      const fullName = profile.name || profile.login || email.split('@')[0];
      const avatarUrl = profile.avatar_url || null;

      // Upsert User and OAuthAccount in a transaction
      const user = await fastify.prisma.$transaction(async (tx) => {
        let dbUser = await tx.user.findUnique({ where: { email } });

        if (!dbUser) {
          dbUser = await tx.user.create({
            data: {
              email,
              fullName,
              avatarUrl,
              emailVerified: true
            }
          });
        }

        const oauthEncryptedAccess = encrypt(accessToken);
        const oauthEncryptedRefresh = tokenResponse.token.refresh_token ? encrypt(tokenResponse.token.refresh_token) : null;
        
        await tx.oAuthAccount.upsert({
          where: { provider_providerId: { provider: 'github', providerId } },
          update: {
            accessToken: oauthEncryptedAccess,
            refreshToken: oauthEncryptedRefresh
          },
          create: {
            userId: dbUser.id,
            provider: 'github',
            providerId,
            accessToken: oauthEncryptedAccess,
            refreshToken: oauthEncryptedRefresh
          }
        });

        return dbUser;
      });

      // Create session
      const session = await fastify.authService.createSession(user.id, undefined, {
        ip: request.ip,
        userAgent: request.headers['user-agent']
      });

      // Set cookie
      reply.setCookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        ...crossSiteCookieOptions(fastify),
        path: '/api/v1/auth',
        maxAge: fastify.config.JWT_REFRESH_EXPIRY
      });

      await logAuditEvent({
        userId: user.id,
        action: 'auth.oauth.connected',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: { provider: 'github' }
      });

      const redirectUrl = `${fastify.config.ALLOWED_ORIGINS[0]}/dashboard?oauth=success`;
      return reply.redirect(redirectUrl);

    } catch (err: any) {
      fastify.log.error(err);
      return reply.redirect(`${fastify.config.ALLOWED_ORIGINS[0]}/login?error=oauth_failed`);
    }
  });
}
