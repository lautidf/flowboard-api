import { NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';

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