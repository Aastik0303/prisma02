import { z } from 'zod';

const sanitizeString = (val: string) => {
  return val.replace(/<[^>]*>/g, '').trim();
};

export const createProjectSchema = z.object({
  title: z.string()
    .min(2, 'Project title must be at least 2 characters')
    .max(100, 'Project title cannot exceed 100 characters')
    .transform(sanitizeString),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .transform(sanitizeString)
    .optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Industry-level']).default('Beginner'),
  track: z.string().default('Web Dev'),
  teamId: z.string().uuid('Invalid Team ID').optional()
});

export const createDocumentSchema = z.object({
  title: z.string()
    .min(2, 'Document title must be at least 2 characters')
    .max(200, 'Document title cannot exceed 200 characters')
    .transform(sanitizeString),
  content: z.string()
});

export const createFileSchema = z.object({
  name: z.string().min(1).max(255).transform(sanitizeString),
  url: z.string().url('Invalid file URL'),
  size: z.number().int().positive('Size must be positive'),
  mimeType: z.string().min(1)
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type CreateFileInput = z.infer<typeof createFileSchema>;
