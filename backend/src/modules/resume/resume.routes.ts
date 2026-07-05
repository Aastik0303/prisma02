import multipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import { AppError } from '../../app.js';
import { resumeAiRateLimit, resumeUploadRateLimit } from '../../plugins/rateLimit.js';
import { MAX_RESUME_BYTES } from './resume.extractor.js';
import {
  analyzeResumeBodySchema,
  fixResumeBodySchema
} from './resume.schema.js';
import { runResumeWorkflow } from './resume.workflow.js';

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

  fastify.post('/upload', {
    config: { rateLimit: resumeUploadRateLimit }
  }, async (request, reply) => {
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

    const rawTargetRoleField = part.fields.targetRole;
    const targetRoleField = Array.isArray(rawTargetRoleField)
      ? rawTargetRoleField[0]
      : rawTargetRoleField;
    const targetRole = targetRoleField && targetRoleField.type === 'field'
      ? String(targetRoleField.value).trim().slice(0, 120)
      : '';

    let result;
    try {
      result = await runResumeWorkflow({
        operation: 'analyze',
        fileBuffer: buffer,
        filename: part.filename,
        mimetype: part.mimetype,
        targetRole
      });
    } finally {
      buffer.fill(0);
    }

    return reply.code(200).send({
      filename: part.filename,
      resumeText: result.resumeText,
      analysis: result.analysis
    });
  });

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
