import z from 'zod';
import { MembershipRole } from '../../../generated/prisma/enums';

export const createRequestSchema = z.object({
	body: z.object({
		name: z.string().min(1).max(255)
	})
});

export const getAllRequestSchema = z.object({
	query: z.object({
		role: z.enum(MembershipRole).optional()
	})
});

export const getOneRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	})
});

export const removeRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	})
});