import { Queue, Worker } from 'bullmq';
import { Resend } from 'resend';
import { config } from '../config/config.js';

type EmailType =
  | 'verification'
  | 'password_reset'
  | 'account_locked'
  | 'suspicious_login'
  | 'welcome'
  | 'login_notification'
  | 'contact_request';

interface EmailJobPayload {
  to: string;
  type: EmailType;
  data: Record<string, unknown>;
  replyTo?: string;
}

const EMAIL_QUEUE_NAME = 'email-jobs';
let emailQueue: Queue | null = null;
let emailWorker: Worker | null = null;
const resend = new Resend(config.RESEND_API_KEY);

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const plainText = (value: unknown) => String(value ?? '').trim();

export function renderEmailTemplate(
  type: EmailType,
  data: Record<string, unknown>
): { html: string; text: string; subject: string } {
  const fullName = escapeHtml(data.fullName || 'there');
  const headerHtml = `
    <!doctype html>
    <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body{margin:0;background:#f8fafc;color:#0f172a;font-family:Arial,sans-serif}.wrapper{padding:32px 16px}
      .card{max-width:560px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e2e8f0;border-radius:8px}
      .brand{color:#4f46e5;font-size:18px;font-weight:700;margin-bottom:24px}h1{margin:0 0 16px;font-size:24px}
      p{margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6}.button{display:inline-block;margin:8px 0 20px;
      padding:12px 20px;color:#fff!important;background:#4f46e5;border-radius:6px;text-decoration:none;font-weight:700}
      .details{margin:16px 0;padding:16px;background:#f1f5f9;border-radius:6px;font-size:14px;line-height:1.7}
      .message{white-space:pre-wrap;overflow-wrap:anywhere}.footer{margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px}
    </style></head><body><div class="wrapper"><div class="card"><div class="brand">Prisma Embedded Codes</div>`;
  const footerHtml = '<div class="footer">This is an automated transactional email from Prisma Embedded Codes.</div></div></div></body></html>';

  let subject = '';
  let bodyHtml = '';
  let text = '';

  switch (type) {
    case 'verification': {
      subject = 'Verify your email address - Prisma Embedded Codes';
      bodyHtml = `<h1>Verify your email</h1><p>Hi ${fullName},</p><p>Confirm your email address to activate your account.</p>
        <a class="button" href="${escapeHtml(data.verificationLink)}">Verify email address</a>
        <p>This link expires in 24 hours. If you did not create this account, you can ignore this email.</p>`;
      text = `Hi ${plainText(data.fullName) || 'there'},\n\nVerify your email address:\n${plainText(data.verificationLink)}\n\nThis link expires in 24 hours.`;
      break;
    }
    case 'password_reset': {
      subject = 'Reset your password - Prisma Embedded Codes';
      bodyHtml = `<h1>Reset your password</h1><p>Hi ${fullName},</p><p>Use the secure link below to choose a new password.</p>
        <a class="button" href="${escapeHtml(data.resetLink)}">Reset password</a>
        <p>This link expires in one hour. If you did not request it, secure your account and contact support.</p>`;
      text = `Hi ${plainText(data.fullName) || 'there'},\n\nReset your password:\n${plainText(data.resetLink)}\n\nThis link expires in one hour.`;
      break;
    }
    case 'account_locked': {
      subject = 'Security alert: your account is locked';
      bodyHtml = `<h1>Account temporarily locked</h1><p>Hi ${fullName},</p>
        <p>Your account was locked after repeated failed sign-in attempts.</p>
        <a class="button" href="${escapeHtml(data.unlockLink)}">Unlock account</a>`;
      text = `Hi ${plainText(data.fullName) || 'there'},\n\nYour account was locked after repeated failed sign-in attempts.\n${plainText(data.unlockLink)}`;
      break;
    }
    case 'suspicious_login': {
      subject = 'Security alert - Prisma Embedded Codes';
      bodyHtml = `<h1>Security activity detected</h1><p>Hi ${fullName},</p>
        <p>${escapeHtml(data.customMessage || 'We detected security-sensitive activity on your account.')}</p>
        <div class="details"><strong>IP address:</strong> ${escapeHtml(data.ip || 'Unknown')}<br>
        <strong>Device:</strong> ${escapeHtml(data.userAgent || 'Unknown')}<br>
        <strong>Time:</strong> ${escapeHtml(data.loginTime || new Date().toISOString())}</div>`;
      text = `${plainText(data.customMessage) || 'Security-sensitive activity was detected.'}\nIP: ${plainText(data.ip) || 'Unknown'}\nDevice: ${plainText(data.userAgent) || 'Unknown'}`;
      break;
    }
    case 'welcome': {
      subject = 'Welcome to Prisma Embedded Codes';
      bodyHtml = `<h1>Welcome, ${fullName}</h1><p>Your email is verified and your account is active.</p>
        <p>You can now sign in and continue to your learning workspace.</p>`;
      text = `Welcome, ${plainText(data.fullName) || 'there'}! Your email is verified and your account is active.`;
      break;
    }
    case 'login_notification': {
      subject = 'New sign-in to your Prisma Embedded Codes account';
      bodyHtml = `<h1>New sign-in</h1><p>Hi ${fullName},</p><p>Your account was signed in successfully.</p>
        <div class="details"><strong>Time:</strong> ${escapeHtml(data.loginTime)}<br>
        <strong>IP address:</strong> ${escapeHtml(data.ip || 'Unknown')}<br>
        <strong>Device:</strong> ${escapeHtml(data.userAgent || 'Unknown')}</div>
        <p>If this was not you, reset your password immediately.</p>`;
      text = `New sign-in\nTime: ${plainText(data.loginTime)}\nIP: ${plainText(data.ip) || 'Unknown'}\nDevice: ${plainText(data.userAgent) || 'Unknown'}\n\nIf this was not you, reset your password immediately.`;
      break;
    }
    case 'contact_request': {
      subject = `Contact request from ${plainText(data.name).slice(0, 80)}`;
      bodyHtml = `<h1>New contact request</h1><div class="details"><strong>Name:</strong> ${escapeHtml(data.name)}<br>
        <strong>Email:</strong> ${escapeHtml(data.email)}<br><strong>IP address:</strong> ${escapeHtml(data.ip || 'Unknown')}<br>
        <strong>Received:</strong> ${escapeHtml(data.receivedAt)}</div><p><strong>Message</strong></p>
        <p class="message">${escapeHtml(data.message)}</p>`;
      text = `New contact request\nName: ${plainText(data.name)}\nEmail: ${plainText(data.email)}\nReceived: ${plainText(data.receivedAt)}\n\n${plainText(data.message)}`;
      break;
    }
  }

  return { html: headerHtml + bodyHtml + footerHtml, text, subject };
}

async function deliverEmail(payload: EmailJobPayload) {
  const { html, text, subject } = renderEmailTemplate(payload.type, payload.data);
  const response = await resend.emails.send({
    from: config.EMAIL_FROM,
    to: payload.to,
    subject,
    html,
    text,
    ...(payload.replyTo ? { replyTo: payload.replyTo } : {})
  });
  if (response.error) throw new Error(`Resend API error: ${response.error.message}`);
}

export async function initializeEmailQueue() {
  if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') return;
  try {
    const connection = { url: config.REDIS_URL };
    emailQueue = new Queue(EMAIL_QUEUE_NAME, { connection });
    emailWorker = new Worker(EMAIL_QUEUE_NAME, async job => deliverEmail(job.data as EmailJobPayload), {
      connection,
      concurrency: 2
    });
    emailWorker.on('failed', (job, error) => {
      console.error(`Email job ${job?.id || 'unknown'} failed: ${error.message}`);
    });
  } catch (error) {
    console.error(`Failed to initialize the email queue: ${(error as Error).message}`);
  }
}

export const sentEmailsTestBox: Array<{
  to: string;
  type: string;
  data: Record<string, unknown>;
  subject: string;
  replyTo?: string;
}> = [];

export async function sendEmail(
  to: string,
  type: EmailType,
  data: Record<string, unknown>,
  options: { replyTo?: string; throwOnError?: boolean } = {}
) {
  const { subject } = renderEmailTemplate(type, data);
  const payload: EmailJobPayload = { to, type, data, replyTo: options.replyTo };

  if (config.NODE_ENV === 'test') {
    sentEmailsTestBox.push({ ...payload, subject });
    return;
  }

  try {
    if (emailQueue) {
      await emailQueue.add('send', payload, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: 500
      });
    } else {
      await deliverEmail(payload);
    }
  } catch (error) {
    console.error(`Failed to send ${type} email to ${to}: ${(error as Error).message}`);
    if (options.throwOnError) throw error;
  }
}

export const sendVerificationEmail = (
  to: string,
  data: { fullName: string; verificationLink: string }
) => sendEmail(to, 'verification', data);

export const sendWelcomeEmail = (
  to: string,
  data: { fullName: string }
) => sendEmail(to, 'welcome', data);

export const sendLoginNotification = (
  to: string,
  data: { fullName: string; loginTime: string; ip: string; userAgent: string }
) => sendEmail(to, 'login_notification', data);

export const sendContactRequestEmail = (
  data: { name: string; email: string; message: string; ip: string; receivedAt: string }
) => {
  if (!config.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is not configured');
  return sendEmail(config.ADMIN_EMAIL, 'contact_request', data, {
    replyTo: data.email,
    throwOnError: true
  });
};

export async function closeEmailQueue() {
  await emailWorker?.close();
  await emailQueue?.close();
}

export default {
  initializeEmailQueue,
  closeEmailQueue,
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotification,
  sendContactRequestEmail,
  renderEmailTemplate,
  sentEmailsTestBox
};
