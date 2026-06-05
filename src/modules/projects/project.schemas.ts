import z from 'zod';

export const createRequestSchema = z.object({
	params: z.object({
		organizationId: z.cuid2()
	}),
	body: z.object({
		name: z.string().min(1)
	}),
});