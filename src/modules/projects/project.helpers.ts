import { NotFoundError } from '../../errors/errors.js';
import { prisma } from '../../lib/prisma.js';

export async function getOrganizationId(projectId: string) {
	const project = await prisma.project.findUnique({
		where: {
			id: projectId
		},
		select: {
			organizationId: true
		}
	});

	if (!project) {
		throw new NotFoundError('Project not found');
	}

	return project.organizationId;
}