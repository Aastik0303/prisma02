import { Queue, Worker } from 'bullmq';
import { Resend } from 'resend';
import { config } from '../config/config.js';

interface EmailJobPayload {
  to: string;
  type: 'verification' | 'password_reset' | 'account_locked' | 'suspicious_login' | 'welcome';
  data: Record<string, any>;
}

const EMAIL_QUEUE_NAME = 'email-jobs';
let emailQueue: Queue | null = null;
let emailWorker: Worker | null = null;

// Initialize Resend client
const resend = new Resend(config.RESEND_API_KEY);

/**
 * Renders the HTML, plain text, and subject for the given email template type.
 * Indigo theme based on Prisma branding.
 */
export function renderEmailTemplate(
  type: 'verification' | 'password_reset' | 'account_locked' | 'suspicious_login' | 'welcome',
  data: Record<string, any>
): { html: string; text: string; subject: string } {
  const brandColor = '#6366f1'; // Indigo-500
  const bgDark = '#0f172a'; // Slate-900
  const textLight = '#f8fafc'; // Slate-50
  const textMuted = '#94a3b8'; // Slate-400
  const cardBg = '#1e293b'; // Slate-800
  
  const headerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; background-color: ${bgDark}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${textLight}; }
        .wrapper { width: 100%; table-layout: fixed; background-color: ${bgDark}; padding: 40px 20px; box-sizing: border-box; }
        .card { max-width: 500px; margin: 0 auto; background-color: ${cardBg}; border-radius: 12px; border: 1px solid #334155; padding: 32px; box-sizing: border-box; }
        .logo { font-size: 20px; font-weight: bold; color: ${brandColor}; text-decoration: none; margin-bottom: 24px; display: block; }
        h1 { font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: ${textLight}; }
        p { font-size: 16px; line-height: 1.5; color: ${textLight}; margin-top: 0; margin-bottom: 16px; }
        .btn { display: inline-block; background-color: ${brandColor}; color: #ffffff !important; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; margin: 16px 0; text-align: center; }
        .footer { margin-top: 32px; font-size: 12px; line-height: 1.5; color: ${textMuted}; border-top: 1px solid #334155; padding-top: 16px; }
        .footer a { color: ${brandColor}; text-decoration: none; }
        @media only screen and (max-width: 600px) {
          .card { padding: 24px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="card">
          <div class="logo">Prisma Embedded Codes</div>
  `;

  const footerHtml = `
          <div class="footer">
            <p>You received this email because you are registered on Prisma Embedded Codes.</p>
            <p>&copy; 2026 Prisma Embedded Codes. All rights reserved.<br><a href="{{unsubscribeUrl}}">Unsubscribe</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  let subject = '';
  let bodyHtml = '';
  let text = '';

  const unsubscribeUrl = data.unsubscribeUrl || 'https://prismaembedded.codes/unsubscribe';

  switch (type) {
    case 'verification': {
      subject = 'Verify your email address — Prisma Embedded Codes';
      const link = data.verificationLink || 'https://prismaembedded.codes/verify';
      bodyHtml = `
        <h1>Verify your email</h1>
        <p>Hi ${data.fullName || 'there'},</p>
        <p>Thank you for signing up for Prisma Embedded Codes. To complete your registration and activate your account, please click the button below to verify your email address:</p>
        <div style="text-align: center;">
          <a href="${link}" class="btn">Verify Email Address</a>
        </div>
        <p>This verification link will expire in 24 hours. If you did not sign up for this account, you can safely ignore this email.</p>
      `;
      text = `Verify your email address for Prisma Embedded Codes.\n\nHi ${data.fullName || 'there'},\n\nPlease verify your email by opening this link in your browser:\n${link}\n\nThis link will expire in 24 hours.`;
      break;
    }
    case 'password_reset': {
      subject = 'Reset your password — Prisma Embedded Codes';
      const link = data.resetLink || 'https://prismaembedded.codes/reset-password';
      bodyHtml = `
        <h1>Password Reset Request</h1>
        <p>Hi ${data.fullName || 'there'},</p>
        <p>We received a request to reset the password for your Prisma Embedded Codes account. Click the button below to set a new password:</p>
        <div style="text-align: center;">
          <a href="${link}" class="btn">Reset Password</a>
        </div>
        <p>This password reset link will expire in 1 hour. If you did not request this, please secure your account immediately or contact support.</p>
      `;
      text = `Reset your password for Prisma Embedded Codes.\n\nHi ${data.fullName || 'there'},\n\nPlease reset your password by opening this link in your browser:\n${link}\n\nThis link will expire in 1 hour.`;
      break;
    }
    case 'account_locked': {
      subject = 'Security Alert: Your account has been locked';
      const link = data.unlockLink || 'https://prismaembedded.codes/unlock';
      bodyHtml = `
        <h1>Account Temporarily Locked</h1>
        <p>Hi ${data.fullName || 'there'},</p>
        <p>For your security, your account has been temporarily locked because we detected too many failed login attempts.</p>
        <p>To unlock your account immediately, please click the button below:</p>
        <div style="text-align: center;">
          <a href="${link}" class="btn">Unlock Account</a>
        </div>
        <p>If you did not initiate this lock or are having issues, please contact our security team.</p>
      `;
      text = `Security Alert: Your account has been locked.\n\nHi ${data.fullName || 'there'},\n\nYour account was locked due to too many failed login attempts. Unlock your account by visiting:\n${link}`;
      break;
    }
    case 'suspicious_login': {
      subject = 'Security Alert: Suspicious login detected';
      bodyHtml = `
        <h1>New Login Detected</h1>
        <p>Hi ${data.fullName || 'there'},</p>
        <p>We detected a login to your account from a new device or location:</p>
        <div style="background-color: #0f172a; padding: 16px; border-radius: 6px; margin: 16px 0; font-family: monospace; font-size: 14px;">
          <strong>IP Address:</strong> ${data.ip || 'Unknown'}<br>
          <strong>Device:</strong> ${data.userAgent || 'Unknown'}<br>
          <strong>Time:</strong> ${new Date().toUTCString()}
        </div>
        <p>If this was you, no action is needed. If you do not recognize this login, please reset your password immediately to secure your account.</p>
      `;
      text = `Security Alert: Suspicious login detected.\n\nHi ${data.fullName || 'there'},\n\nA new login was detected:\nIP: ${data.ip || 'Unknown'}\nDevice: ${data.userAgent || 'Unknown'}\n\nIf this was not you, please reset your password immediately.`;
      break;
    }
    case 'welcome': {
      subject = 'Welcome to Prisma Embedded Codes!';
      bodyHtml = `
        <h1>Welcome, ${data.fullName}!</h1>
        <p>Your email has been verified, and your account is active.</p>
        <p>Prisma Embedded Codes is designed to guide your journey from basic embedded programming up to professional development and career opportunities. We are thrilled to have you join our community.</p>
        <p>Head over to your student dashboard to get started on your customized learning path.</p>
      `;
      text = `Welcome to Prisma Embedded Codes, ${data.fullName}!\n\nYour email has been verified and your account is ready. Log in to start learning.`;
      break;
    }
  }

  const finalHtml = headerHtml + bodyHtml + footerHtml.replace('{{unsubscribeUrl}}', unsubscribeUrl);
  return { html: finalHtml, text, subject };
}

/**
 * Initializes the BullMQ Email Queue and Worker.
 * In test mode, this is skipped.
 */
export async function initializeEmailQueue() {
  if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
    return;
  }

  try {
    const connectionOpts = {
      url: config.REDIS_URL
    };

    emailQueue = new Queue(EMAIL_QUEUE_NAME, {
      connection: connectionOpts
    });

    emailWorker = new Worker(
      EMAIL_QUEUE_NAME,
      async (job) => {
        const { to, type, data } = job.data as EmailJobPayload;
        const { html, text, subject } = renderEmailTemplate(type, data);

        // Send transactional email via Resend SDK
        const response = await resend.emails.send({
          from: config.EMAIL_FROM,
          to,
          subject,
          html,
          text
        });

        if (response.error) {
          throw new Error(`Resend API Error: ${response.error.message}`);
        }
      },
      {
        connection: connectionOpts,
        concurrency: 2
      }
    );

    emailWorker.on('failed', (job, err) => {
      console.error(`❌ Email Job [${job?.id}] failed: ${err.message}`);
    });
  } catch (error: any) {
    console.error(`⚠️ Failed to initialize BullMQ email queue: ${error.message}`);
  }
}

// Stores sent emails in memory during testing for assertions
export const sentEmailsTestBox: Array<{ to: string; type: string; data: any; subject: string }> = [];

/**
 * Dispatch an email to the queue.
 * In test mode, it pushes to an in-memory array for synchronous testing without live SMTP.
 */
export async function sendEmail(to: string, type: EmailJobPayload['type'], data: Record<string, any>) {
  const { subject } = renderEmailTemplate(type, data);

  if (config.NODE_ENV === 'test') {
    sentEmailsTestBox.push({ to, type, data, subject });
    return;
  }

  try {
    if (emailQueue) {
      await emailQueue.add('send', { to, type, data }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: 500
      });
    } else {
      // Direct send fallback if queue not running
      const { html, text } = renderEmailTemplate(type, data);
      await resend.emails.send({
        from: config.EMAIL_FROM,
        to,
        subject,
        html,
        text
      });
    }
  } catch (error: any) {
    console.error(`⚠️ Failed to send email to ${to}: ${error.message}`);
  }
}

/**
 * Shut down the BullMQ components gracefully.
 */
export async function closeEmailQueue() {
  if (emailWorker) {
    await emailWorker.close();
  }
  if (emailQueue) {
    await emailQueue.close();
  }
}

export default { initializeEmailQueue, sendEmail, closeEmailQueue, renderEmailTemplate, sentEmailsTestBox };
