import multipart from '@fastify/multipart';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../app.js';
import { requireAuth } from '../auth/auth.middleware.js';
import { resumeAiRateLimit, resumeUploadRateLimit } from '../../plugins/rateLimit.js';
import { MAX_RESUME_BYTES } from './resume.extractor.js';
import { parseResumeTextToJson, improveParsedResumeJson } from './resume.ai.js';
import { renderResumeHtml, renderResumePdf, resumeJsonToLines } from './resume.renderer.js';
import {
  analyzeResumeBodySchema,
  createResumeBodySchema,
  fixResumeBodySchema,
  improveStoredResumeBodySchema,
  parsedResumeJsonSchema,
  resumeIdParamsSchema,
  templateConfigSchema,
  updateResumeBodySchema
} from './resume.schema.js';
import { runResumeWorkflow } from './resume.workflow.js';

const MAX_RESUMES_PER_USER = 4;

const resumeStore = (fastify: FastifyInstance) => (fastify.prisma as any).resume;

const defaultTemplateConfig = () => templateConfigSchema.parse({
  templateId: 'ats-clean',
  page: { width: 612, height: 792, margin: 48 },
  fonts: {
    name: { family: 'Helvetica', size: 24, weight: 700 },
    heading: { family: 'Helvetica', size: 11, weight: 700 },
    body: { family: 'Helvetica', size: 10 }
  },
  colors: {
    text: '#0f172a',
    muted: '#475569',
    accent: '#4f46e5',
    background: '#ffffff'
  },
  sections: [
    { key: 'personal_info', x: 48, y: 48, width: 516 },
    { key: 'summary', x: 48, y: 132, width: 516 },
    { key: 'skills', x: 48, y: 206, width: 516 },
    { key: 'experience', x: 48, y: 280, width: 516 },
    { key: 'projects', x: 48, y: 450, width: 516 },
    { key: 'education', x: 48, y: 590, width: 516 }
  ]
});

async function enforceResumeLimit(request: FastifyRequest, _reply: FastifyReply) {
  const count = await resumeStore(request.server).count({
    where: { userId: request.user!.id }
  });

  if (count >= MAX_RESUMES_PER_USER) {
    throw new AppError(
      400,
      'MAXIMUM_RESUME_LIMIT_REACHED',
      'Maximum resume limit reached. Please delete an existing resume to proceed.'
    );
  }
}

async function getOwnedResume(request: FastifyRequest) {
  const params = resumeIdParamsSchema.parse(request.params);
  const resume = await resumeStore(request.server).findFirst({
    where: {
      id: params.id,
      userId: request.user!.id
    }
  });

  if (!resume) {
    throw new AppError(404, 'RESUME_NOT_FOUND', 'Resume not found.');
  }

  return resume;
}

function extractMultipartField(part: { fields: Record<string, any> }, name: string, maxLength: number) {
  const raw = part.fields[name];
  const field = Array.isArray(raw) ? raw[0] : raw;
  return field && field.type === 'field'
    ? String(field.value).trim().slice(0, maxLength)
    : '';
}

function serializeResumeRecord(resume: any) {
  return {
    id: resume.id,
    userId: resume.userId,
    title: resume.title,
    rawExtractedText: resume.rawExtractedText,
    parsedJsonData: resume.parsedJsonData,
    templateConfig: resume.templateConfig,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt
  };
}

function buildResumeTextForScan(parsedJsonData: unknown, fallbackText = '') {
  const parsed = parsedResumeJsonSchema.safeParse(parsedJsonData);
  const structuredText = parsed.success ? resumeJsonToLines(parsed.data).join('\n') : '';
  const scanText = structuredText.trim().length >= 50 ? structuredText : fallbackText;
  return scanText.trim();
}

async function runSavedResumeScan(input: {
  parsedJsonData: unknown;
  rawExtractedText: string;
  targetRole?: string;
}) {
  const resumeText = buildResumeTextForScan(input.parsedJsonData, input.rawExtractedText);
  if (resumeText.length < 50) return undefined;

  try {
    const result = await runResumeWorkflow({
      operation: 'analyze',
      resumeText,
      targetRole: input.targetRole
    });

    return {
      resumeText: result.resumeText,
      analysis: result.analysis,
      suggestions: result.suggestions
    };
  } catch (error) {
    console.warn('Saved resume ATS scan failed after persistence', {
      name: (error as { name?: string })?.name,
      message: (error as { message?: string })?.message?.slice(0, 300)
    });
    return undefined;
  }
}

function serializeResumeWithScannerSession(resume: any, scannerSession?: Awaited<ReturnType<typeof runSavedResumeScan>>) {
  return {
    ...serializeResumeRecord(resume),
    ...(scannerSession ? { scannerSession } : {})
  };
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
    preHandler: [requireAuth, enforceResumeLimit]
  }, async (request, reply) => {
    const body = createResumeBodySchema.parse(request.body);
    const resume = await resumeStore(fastify).create({
      data: {
        userId: request.user!.id,
        title: body.title,
        rawExtractedText: body.rawExtractedText,
        parsedJsonData: body.parsedJsonData,
        templateConfig: body.templateConfig
      }
    });
    const scannerSession = await runSavedResumeScan({
      parsedJsonData: resume.parsedJsonData,
      rawExtractedText: resume.rawExtractedText
    });

    return reply.code(201).send(serializeResumeWithScannerSession(resume, scannerSession));
  });

  fastify.get('/resumes', {
    preHandler: [requireAuth]
  }, async (request) => {
    const resumes = await resumeStore(fastify).findMany({
      where: { userId: request.user!.id },
      orderBy: { updatedAt: 'desc' }
    });
    return resumes.map(serializeResumeRecord);
  });

  fastify.post('/resumes/upload', {
    preHandler: [requireAuth, enforceResumeLimit],
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

    const title = extractMultipartField(part, 'title', 160)
      || part.filename.replace(/\.[^.]+$/, '').slice(0, 160)
      || 'Untitled resume';
    const targetRole = extractMultipartField(part, 'targetRole', 120);

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

    const parsedJsonData = await parseResumeTextToJson(result.resumeText);
    const templateConfig = defaultTemplateConfig();
    const resume = await resumeStore(fastify).create({
      data: {
        userId: request.user!.id,
        title,
        rawExtractedText: result.resumeText,
        parsedJsonData,
        templateConfig
      }
    });

    return reply.code(201).send({
      resume: serializeResumeRecord(resume),
      analysis: result.analysis
    });
  });

  fastify.get('/resumes/:id/html', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const resume = await getOwnedResume(request);
    const data = parsedResumeJsonSchema.parse(resume.parsedJsonData);
    const template = templateConfigSchema.parse(resume.templateConfig);

    return reply
      .type('text/html; charset=utf-8')
      .send(renderResumeHtml({ data, template }));
  });

  fastify.get('/resumes/:id/download', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const resume = await getOwnedResume(request);
    const data = parsedResumeJsonSchema.parse(resume.parsedJsonData);
    const template = templateConfigSchema.parse(resume.templateConfig);
    const pdf = await renderResumePdf({ data, template });
    const safeTitle = resume.title.replace(/[^a-z0-9-]+/gi, '-').replace(/(^-|-$)/g, '') || 'resume';

    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`)
      .send(pdf);
  });

  fastify.post('/resumes/:id/improve', {
    preHandler: [requireAuth],
    config: { rateLimit: resumeAiRateLimit }
  }, async (request) => {
    const resume = await getOwnedResume(request);
    const body = improveStoredResumeBodySchema.parse(request.body);
    const currentJson = parsedResumeJsonSchema.parse(resume.parsedJsonData);
    const improvedJson = await improveParsedResumeJson({
      parsedJsonData: currentJson,
      targetRole: body.targetRole,
      instruction: body.instruction
    });

    const updated = await resumeStore(fastify).update({
      where: { id: resume.id },
      data: {
        parsedJsonData: improvedJson
      }
    });
    const scannerSession = await runSavedResumeScan({
      parsedJsonData: updated.parsedJsonData,
      rawExtractedText: updated.rawExtractedText,
      targetRole: body.targetRole
    });

    return serializeResumeWithScannerSession(updated, scannerSession);
  });

  fastify.get('/resumes/:id', {
    preHandler: [requireAuth]
  }, async (request) => {
    return serializeResumeRecord(await getOwnedResume(request));
  });

  fastify.put('/resumes/:id', {
    preHandler: [requireAuth]
  }, async (request) => {
    const resume = await getOwnedResume(request);
    const body = updateResumeBodySchema.parse(request.body);
    const updated = await resumeStore(fastify).update({
      where: { id: resume.id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.rawExtractedText !== undefined ? { rawExtractedText: body.rawExtractedText } : {}),
        ...(body.parsedJsonData !== undefined ? { parsedJsonData: body.parsedJsonData } : {}),
        ...(body.templateConfig !== undefined ? { templateConfig: body.templateConfig } : {})
      }
    });
    const scannerSession = await runSavedResumeScan({
      parsedJsonData: updated.parsedJsonData,
      rawExtractedText: updated.rawExtractedText
    });

    return serializeResumeWithScannerSession(updated, scannerSession);
  });

  fastify.delete('/resumes/:id', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const resume = await getOwnedResume(request);
    await resumeStore(fastify).delete({ where: { id: resume.id } });
    return reply.code(204).send();
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
