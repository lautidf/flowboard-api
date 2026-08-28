import z from 'zod';
import { MembershipRole } from '../../generated/prisma/enums.js';

export const updateRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid(),
    userId: z.cuid()
  }),
  body: z.object({
    role: z.enum(MembershipRole)
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
    userId: z.cuid()
  })
});

export const leaveRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid()
  })
});
