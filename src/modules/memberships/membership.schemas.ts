import z from 'zod';
import { MembershipRole } from '../../../generated/prisma/enums';

export const updateRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2(),
		userId: z.cuid2()
	}),
	body: z.object({
		role: z.enum(MembershipRole)
	})
});

export const getByOrganizationRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	})
});

export const removeRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2(),
		userId: z.cuid2()
	})
});

export const leaveRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	})
});
