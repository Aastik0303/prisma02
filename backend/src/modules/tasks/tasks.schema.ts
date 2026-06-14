import { z } from 'zod';

const sanitizeString = (val: string) => {
  return val.replace(/<[^>]*>/g, '').trim();
};

export const createTaskSchema = z.object({
  projectId: z.string().uuid('Invalid Project ID'),
  title: z.string()
    .min(2, 'Task title must be at least 2 characters')
    .max(100, 'Task title cannot exceed 100 characters')
    .transform(sanitizeString),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .transform(sanitizeString)
    .optional(),
  status: z.enum(['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED']).default('TO_DO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime({ precision: 3, message: 'Invalid ISO due date' }).optional(),
  assigneeId: z.string().uuid('Invalid Assignee ID').optional().nullable()
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'])
});

export const assignTaskSchema = z.object({
  assigneeId: z.string().uuid('Invalid Assignee ID').optional().nullable()
});

export const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long')
    .transform(sanitizeString)
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
