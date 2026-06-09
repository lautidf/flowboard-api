import z from 'zod';
import { Priority, Status } from '../../generated/prisma/enums';

export const createRequestSchema = z.object({
	params: z.object({
		projectId: z.cuid2()
	}),
	body: z.strictObject({
		title: z.string().min(1).max(255),
		description: z.string().min(1).max(2000).nullable().optional()
	}).refine(
		data => Object.keys(data).length > 0,
		{ message: 'At least one field must be provided' }
	)
});

export const getByProjectRequestSchema = z.object({
	params: z.object({
		projectId: z.cuid2()
	}),
	query: z.object({
		priority: z.enum(Priority).optional(),
		assignedToMe: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
		unassigned: z.enum(['true', 'false']).transform(val => val === 'true').optional()
	})
});

export const getOneRequestSchema = z.object({
	params: z.object({
		taskId: z.cuid2()
	})
});

export const updateRequestSchema = z.object({
	params: z.object({
		taskId: z.cuid2()
	}),
	body: z.strictObject({
		title: z.string().min(1).max(255).optional(),
		description: z.string().min(1).max(2000).nullable().optional(),
		priority: z.enum(Priority).optional(),
		assigneeId: z.cuid2().nullable().optional(),
		status: z.enum(Status).optional(),
		position: z.number().int().optional()
	}).refine(
		data => Object.keys(data).length > 0,
		{ message: 'At least one field must be provided for update' }
	)
});

export const removeRequestSchema = z.object({
	params: z.object({
		taskId: z.cuid2()
	})
});