import multipart from '@fastify/multipart';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { AppError } from '../../app.js';
import { requireAuth } from '../auth/auth.middleware.js';
import { resumeAiRateLimit, resumeUploadRateLimit } from '../../plugins/rateLimit.js';
import { MAX_RESUME_BYTES } from './resume.extractor.js';
import { extractResumeDocument } from './resume.extractor.js';
import {
  analyzeResumeBodySchema,
  fixResumeBodySchema,
  optimizeResumeBodySchema
} from './resume.schema.js';
import { optimizeResumeTextForAts } from './resume.ai.js';
import { runResumeWorkflow } from './resume.workflow.js';

const AGENT_RESUME_DOCX_PATH =
  process.env.AGENT_RESUME_DOCX_PATH ||
  'D:\\prisma_embedded_codes2\\prisma_embedded_codes2\\uploads\\resume.docx';

function resumeSavingDisabled() {
  throw new AppError(
    410,
    'RESUME_SAVE_DISABLED',
    'Resume saving has been disabled. You can still scan, fix, and export resumes without storing them.'
  );
}

function extractMultipartField(part: { fields: Record<string, any> }, name: string, maxLength: number) {
  const raw = part.fields[name];
  const field = Array.isArray(raw) ? raw[0] : raw;
  return field && field.type === 'field'
    ? String(field.value).trim().slice(0, maxLength)
    : '';
}

async function persistDocxForAgent(input: { buffer: Buffer; filename: string; mimetype: string }) {
  const extension = input.filename.toLowerCase().split('.').pop();
  const isDocx = extension === 'docx'
    && (
      input.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || input.mimetype === 'application/octet-stream'
    );

  if (!isDocx) return undefined;

  await mkdir(dirname(AGENT_RESUME_DOCX_PATH), { recursive: true });
  await writeFile(AGENT_RESUME_DOCX_PATH, input.buffer);
  return AGENT_RESUME_DOCX_PATH;
}

async function scanUploadedResume(request: FastifyRequest, reply: FastifyReply) {
  let part;
  try {
    part = await request.file({
      limits: { files: 1, fileSize: MAX_RESUME_BYTES }
    });
  } catch {
    throw new AppError(400, 'INVALID_UPLOAD', 'The resume upload is invalid or exceeds 5 MB.');
  }

  if (!part) {
    throw new AppError(400, 'RESUME_REQUIRED', 'A PDF or DOCX resume file is required.');
  }

  let buffer: Buffer;
  try {
    buffer = await part.toBuffer();
  } catch {
    throw new AppError(400, 'RESUME_TOO_LARGE', 'Resume files are limited to 5 MB.');
  }

  const targetRole = extractMultipartField(part, 'targetRole', 120);

  let result;
  let extractedDocument: Awaited<ReturnType<typeof extractResumeDocument>>;
  let savedDocxPath: string | undefined;
  try {
    extractedDocument = await extractResumeDocument({
      buffer,
      filename: part.filename,
      mimetype: part.mimetype,
      includePdfLayout: true
    });
    const layoutText = extractedDocument.uploadedPdfLayout?.blocks?.length
      ? [...extractedDocument.uploadedPdfLayout.blocks]
        .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x)
        .map(block => block.text)
        .join('\n')
      : '';
    const resumeText = layoutText || extractedDocument.text;

    result = await runResumeWorkflow({
      operation: 'analyze',
      resumeText,
      targetRole
    });
    savedDocxPath = await persistDocxForAgent({
      buffer,
      filename: part.filename,
      mimetype: part.mimetype
    });
  } finally {
    buffer.fill(0);
  }

  return reply.code(200).send({
    filename: part.filename,
    ...(savedDocxPath ? { savedDocxPath } : {}),
    ...(extractedDocument.uploadedPdfLayout ? { uploadedPdfLayout: extractedDocument.uploadedPdfLayout } : {}),
    formattedHtml: extractedDocument.formattedHtml,
    resumeText: result.resumeText,
    analysis: result.analysis
  });
}

async function convertUploadedResume(request: FastifyRequest, reply: FastifyReply) {
  let part;
  try {
    part = await request.file({
      limits: { files: 1, fileSize: MAX_RESUME_BYTES }
    });
  } catch {
    throw new AppError(400, 'INVALID_UPLOAD', 'The resume upload is invalid or exceeds 5 MB.');
  }

  if (!part) {
    throw new AppError(400, 'RESUME_REQUIRED', 'A PDF or DOCX resume file is required.');
  }

  let buffer: Buffer;
  try {
    buffer = await part.toBuffer();
  } catch {
    throw new AppError(400, 'RESUME_TOO_LARGE', 'Resume files are limited to 5 MB.');
  }

  let extractedDocument: Awaited<ReturnType<typeof extractResumeDocument>>;
  let savedDocxPath: string | undefined;
  try {
    extractedDocument = await extractResumeDocument({
      buffer,
      filename: part.filename,
      mimetype: part.mimetype,
      includePdfLayout: true
    });
    savedDocxPath = await persistDocxForAgent({
      buffer,
      filename: part.filename,
      mimetype: part.mimetype
    });
  } finally {
    buffer.fill(0);
  }

  const layoutText = extractedDocument.uploadedPdfLayout?.blocks?.length
    ? [...extractedDocument.uploadedPdfLayout.blocks]
      .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x)
      .map(block => block.text)
      .join('\n')
    : '';

  return reply.code(200).send({
    filename: part.filename,
    ...(savedDocxPath ? { savedDocxPath } : {}),
    ...(extractedDocument.uploadedPdfLayout ? { uploadedPdfLayout: extractedDocument.uploadedPdfLayout } : {}),
    formattedHtml: extractedDocument.formattedHtml,
    resumeText: layoutText || extractedDocument.text
  });
}

export async function resumeRoutes(fastify: FastifyInstance) {
  await fastify.register(multipart, {
    limits: {
      files: 1,
      fields: 2,
      parts: 3,
      fileSize: MAX_RESUME_BYTES,
      fieldSize: 200
    }
  });

  fastify.post('/resumes', {
    preHandler: [requireAuth]
  }, async () => resumeSavingDisabled());

  fastify.get('/resumes', {
    preHandler: [requireAuth]
  }, async () => []);

  fastify.post('/resumes/upload', {
    preHandler: [requireAuth],
    config: { rateLimit: resumeUploadRateLimit }
  }, scanUploadedResume);

  fastify.get('/resumes/:id/html', {
    preHandler: [requireAuth]
  }, async () => resumeSavingDisabled());

  fastify.get('/resumes/:id/download', {
    preHandler: [requireAuth]
  }, async () => resumeSavingDisabled());

  fastify.post('/resumes/:id/improve', {
    preHandler: [requireAuth],
    config: { rateLimit: resumeAiRateLimit }
  }, async () => resumeSavingDisabled());

  fastify.get('/resumes/:id', {
    preHandler: [requireAuth]
  }, async () => resumeSavingDisabled());

  fastify.put('/resumes/:id', {
    preHandler: [requireAuth]
  }, async () => resumeSavingDisabled());

  fastify.delete('/resumes/:id', {
    preHandler: [requireAuth]
  }, async () => resumeSavingDisabled());

  fastify.post('/resumes/:id/delete', {
    preHandler: [requireAuth]
  }, async () => resumeSavingDisabled());

  fastify.post('/upload', {
    config: { rateLimit: resumeUploadRateLimit }
  }, scanUploadedResume);

  fastify.post('/convert', {
    config: { rateLimit: resumeUploadRateLimit }
  }, convertUploadedResume);

  fastify.post('/analyze', {
    config: { rateLimit: resumeAiRateLimit }
  }, async (request, reply) => {
    const body = analyzeResumeBodySchema.parse(request.body);
    const result = await runResumeWorkflow({
      operation: 'analyze',
      resumeText: body.resumeText,
      targetRole: body.targetRole
    });
    return reply.send({ resumeText: result.resumeText, analysis: result.analysis });
  });

  fastify.post('/fix', {
    config: { rateLimit: resumeAiRateLimit }
  }, async (request, reply) => {
    const body = fixResumeBodySchema.parse(request.body);
    const result = await runResumeWorkflow({
      operation: 'fix',
      resumeText: body.resumeText,
      targetRole: body.targetRole,
      instruction: body.instruction || (body.issueId ? `Fix issue ${body.issueId}` : '')
    });
    return reply.send({
      originalText: body.resumeText,
      improvedText: result.fix?.improvedText || result.resumeText,
      changes: result.fix?.changes || [],
      analysis: result.analysis
    });
  });

  fastify.post('/optimize-text', {
    config: { rateLimit: resumeAiRateLimit }
  }, async (request, reply) => {
    const body = optimizeResumeBodySchema.parse(request.body);
    const result = await optimizeResumeTextForAts({
      resumeText: body.resumeText,
      targetRole: body.targetRole,
      jobDescription: body.jobDescription
    });
    return reply.send(result);
  });

  fastify.post('/recheck', {
    config: { rateLimit: resumeAiRateLimit }
  }, async (request, reply) => {
    const body = analyzeResumeBodySchema.parse(request.body);
    const result = await runResumeWorkflow({
      operation: 'recheck',
      resumeText: body.resumeText,
      targetRole: body.targetRole
    });
    return reply.send({ resumeText: result.resumeText, analysis: result.analysis });
  });
}
