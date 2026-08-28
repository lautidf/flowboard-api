import z from 'zod';
import { MembershipRole } from '../../generated/prisma/enums.js';

export const sendRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid()
  }),
  body: z.object({
    email: z.email(),
    role: z.enum(MembershipRole).optional().default(MembershipRole.MEMBER)
  })
});

export const getByOrganizationRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid()
  })
});

export const removeRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid(),
    userId: z.string()
  })
});

export const rejectRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid()
  })
});

export const acceptRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid()
  })
});