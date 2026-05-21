import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../errors/errors';
import { requireMembership, requireOrganizationExists } from '../organizations/organization.helpers';
import { MembershipRole } from '../../../generated/prisma/client';

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
	await requireOrganizationExists(organizationId);
	await requireMembership({
		userId,
		organizationId,
		minimumRole: MembershipRole.ADMIN
	});

	const project = await prisma.project.create({
		data: {
			name,
			organizationId
		},
	});

	return project;
}

export async function getByOrganization(
	organizationId: string,
	userId: string
) {
	await requireOrganizationExists(organizationId);
	await requireMembership({ userId,	organizationId });

	const projects = await prisma.project.findMany({
		where: {
			organizationId,
		},
	});

	return projects;
}

export async function getOne(id: string, userId: string) {
	const project = await prisma.project.findUnique({
		where: {
			id,
			organization: {
				memberships: {
					some: {
						userId,
					},
				},
			},
		},
	});
	
	if (!project) {
		throw new NotFoundError('Project not found');
	}

	return project;
}

export const projectService = {
	create,
	getByOrganization,
	getOne,
};