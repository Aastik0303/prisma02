import { z } from 'zod';

const sanitizeText = (value: string) => value.replace(/<[^>]*>/g, '').trim();

export const contactRequestSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .transform(sanitizeText),
  email: z.string()
    .email('Enter a valid email address')
    .max(254, 'Email address is too long')
    .transform(value => value.toLowerCase().trim()),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message cannot exceed 5000 characters')
    .transform(sanitizeText),
  website: z.string().max(0).optional()
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
