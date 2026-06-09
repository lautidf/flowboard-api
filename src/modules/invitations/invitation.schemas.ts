import z from 'zod';
import { MembershipRole } from '../../generated/prisma/enums.js';

export const sendRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	}),
	body: z.object({
		email: z.email(),
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
		userId: z.string()
	})
});

export const rejectRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	})
});

export const acceptRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	})
});