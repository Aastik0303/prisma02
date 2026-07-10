import { z } from 'zod';

const nonEmptyText = z.string().trim().min(1);
const optionalText = z.string().trim().optional().default('');

const resumeLinkSchema = z.object({
  label: nonEmptyText.max(80),
  url: nonEmptyText.max(500)
});

const resumeExperienceSchema = z.object({
  company: optionalText,
  title: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  location: optionalText,
  bullets: z.array(nonEmptyText.max(700)).max(12).default([])
});

const resumeEducationSchema = z.object({
  institution: optionalText,
  degree: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  details: z.array(nonEmptyText.max(500)).max(10).default([])
});

const resumeProjectSchema = z.object({
  title: nonEmptyText.max(160),
  url: optionalText,
  bullets: z.array(nonEmptyText.max(700)).max(12).default([])
});

export const parsedResumeJsonSchema = z.object({
  personal_info: z.object({
    name: optionalText,
    email: optionalText,
    phone: optionalText,
    location: optionalText,
    links: z.array(resumeLinkSchema).max(12).default([])
  }).default({}),
  summary: optionalText,
  skills: z.array(nonEmptyText.max(80)).max(80).default([]),
  experience: z.array(resumeExperienceSchema).max(20).default([]),
  education: z.array(resumeEducationSchema).max(12).default([]),
  projects: z.array(resumeProjectSchema).max(20).default([])
});

export const templateConfigSchema = z.object({
  templateId: z.string().trim().max(120).default('ats-clean'),
  page: z.object({
    width: z.number().positive().max(2000).default(612),
    height: z.number().positive().max(2500).default(792),
    margin: z.number().min(0).max(160).default(48)
  }).default({}),
  fonts: z.record(z.object({
    family: z.string().trim().max(80).default('Helvetica'),
    size: z.number().min(6).max(48).default(10),
    weight: z.number().min(100).max(900).optional()
  })).default({}),
  colors: z.record(z.string().trim().max(40)).default({}),
  sections: z.array(z.object({
    key: z.string().trim().max(80),
    x: z.number().min(0).max(2000),
    y: z.number().min(0).max(2500),
    width: z.number().positive().max(2000),
    style: z.record(z.unknown()).optional()
  })).max(40).default([])
});

export const resumeProblemSchema = z.object({
  id: z.string().trim().min(1),
  title: nonEmptyText,
  category: z.enum([
    'ats',
    'structure',
    'grammar',
    'skills',
    'projects',
    'experience',
    'education',
    'keywords',
    'formatting',
    'missing-section'
  ]),
  severity: z.enum(['critical', 'warning', 'suggestion']),
  why: nonEmptyText,
  suggestedFix: nonEmptyText,
  originalContent: z.string(),
  improvedContent: nonEmptyText
});

export const resumeAnalysisSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  scoreExplanation: nonEmptyText,
  summary: nonEmptyText,
  categoryScores: z.object({
    atsCompatibility: z.number().int().min(0).max(100),
    structure: z.number().int().min(0).max(100),
    grammar: z.number().int().min(0).max(100),
    skills: z.number().int().min(0).max(100),
    projects: z.number().int().min(0).max(100),
    experience: z.number().int().min(0).max(100),
    education: z.number().int().min(0).max(100),
    keywords: z.number().int().min(0).max(100),
    formatting: z.number().int().min(0).max(100)
  }),
  strengths: z.array(nonEmptyText).max(8),
  missingKeywords: z.array(nonEmptyText).max(20),
  problems: z.array(resumeProblemSchema).max(20)
});

export const resumeFixSchema = z.object({
  improvedText: nonEmptyText,
  changes: z.array(nonEmptyText).min(1).max(12)
});

export const analyzeResumeBodySchema = z.object({
  resumeText: z.string().min(50).max(50_000),
  targetRole: z.string().trim().max(120).default('')
});

export const fixResumeBodySchema = analyzeResumeBodySchema.extend({
  issueId: z.string().trim().max(120).optional(),
  instruction: z.string().trim().max(2000).optional()
});

export const resumeIdParamsSchema = z.object({
  id: z.string().uuid()
});

export const createResumeBodySchema = z.object({
  title: nonEmptyText.max(160),
  rawExtractedText: z.string().trim().min(50).max(50_000),
  parsedJsonData: parsedResumeJsonSchema,
  templateConfig: templateConfigSchema
});

export const updateResumeBodySchema = createResumeBodySchema.partial().refine(
  value => Object.keys(value).length > 0,
  'At least one resume field is required.'
);

export const improveStoredResumeBodySchema = z.object({
  targetRole: z.string().trim().max(120).default(''),
  instruction: z.string().trim().max(2000).default('Improve ATS quality while preserving facts.')
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;
export type ResumeProblem = z.infer<typeof resumeProblemSchema>;
export type ResumeFix = z.infer<typeof resumeFixSchema>;
export type ParsedResumeJson = z.infer<typeof parsedResumeJsonSchema>;
export type TemplateConfig = z.infer<typeof templateConfigSchema>;
