import { z } from 'zod';

const sanitizeString = (val: string) => {
  return val.replace(/<[^>]*>/g, '').trim();
};

export const createTeamSchema = z.object({
  name: z.string()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name cannot exceed 100 characters')
    .transform(sanitizeString),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .transform(sanitizeString)
    .optional()
});

export const inviteMemberSchema = z.object({
  inviteeEmail: z.string()
    .email('Invalid email address')
    .max(254, 'Email address is too long')
    .transform(val => val.toLowerCase().trim()),
  role: z.enum(['LEADER', 'MEMBER']).default('MEMBER')
});

export const respondInvitationSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED'])
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['LEADER', 'MEMBER'])
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type RespondInvitationInput = z.infer<typeof respondInvitationSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
