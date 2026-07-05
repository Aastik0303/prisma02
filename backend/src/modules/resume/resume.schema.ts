import { z } from 'zod';

const nonEmptyText = z.string().trim().min(1);

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
  instruction: z.string().trim().max(500).optional()
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;
export type ResumeProblem = z.infer<typeof resumeProblemSchema>;
export type ResumeFix = z.infer<typeof resumeFixSchema>;
