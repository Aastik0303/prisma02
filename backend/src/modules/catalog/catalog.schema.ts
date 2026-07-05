import { z } from 'zod';

const clean = (value: string) => value.replace(/<[^>]*>/g, '').trim();
const optionalUrl = z.union([z.string().url(), z.literal('')]).optional().transform(value => value || null);

export const createCourseSchema = z.object({
  title: z.string().min(3).max(120).transform(clean),
  subtitle: z.string().min(3).max(180).transform(clean),
  description: z.string().min(20).max(3000).transform(clean),
  syllabus: z.array(z.string().min(2).max(200).transform(clean)).min(1).max(30),
  duration: z.string().min(2).max(80).transform(clean),
  rating: z.number().min(0).max(5).default(0),
  modulesCount: z.number().int().min(1).max(100).default(1),
  badge: z.string().max(50).transform(clean).optional(),
  accent: z.enum(['indigo', 'purple', 'cyan', 'emerald', 'amber', 'rose']).default('indigo'),
  actionUrl: optionalUrl,
  published: z.boolean().default(true)
});

export const updateCourseSchema = createCourseSchema.partial();

export const createCatalogProjectSchema = z.object({
  title: z.string().min(3).max(120).transform(clean),
  category: z.enum(['frontend', 'fullstack', 'aiml', 'backend', 'mobile', 'embedded', 'security']),
  tier: z.enum(['Basic', 'Intermediate', 'Advanced']),
  description: z.string().min(20).max(3000).transform(clean),
  price: z.number().int().min(0).max(1_000_000).default(0),
  popular: z.boolean().default(false),
  free: z.boolean().default(false),
  actionUrl: optionalUrl,
  published: z.boolean().default(true)
});

export const catalogIdSchema = z.object({ id: z.string().uuid() });
