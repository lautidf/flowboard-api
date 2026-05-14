import { Request } from 'express';
import { prisma } from '../../lib/prisma';

type CreateProjectInput = {
	name: string;
	organizationId: string;
	userId: string;
};

export async function create({
	name,
	organizationId,
	userId
}: CreateProjectInput) {
	const project = await prisma.project.create({
		data: {
			name,
			organizationId,
			userId,
		},
	});

	return project;
}

export const projectService = {
	create,
};