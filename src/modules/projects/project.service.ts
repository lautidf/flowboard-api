import { prisma } from '../../lib/prisma';
import { MembershipRole } from '../../../generated/prisma/enums';
import { ForbiddenError } from '../../errors/errors';

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
	await validateMembership(userId, organizationId, true);

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
	await validateMembership(userId, organizationId);

	const projects = await prisma.project.findMany({
		where: {
			organizationId,
		},
	});

	return projects;
}

export const projectService = {
	create,
	getByOrganization,
};

async function validateMembership(
	userId: string,
	organizationId: string,
	mustBeAdmin = false
) {
	const membership = await prisma.membership.findFirst({
		where: {
			userId,
			organizationId,
		},
	});

	if (!membership) {
		throw new ForbiddenError('User is not a member of the organization');
	}

	if(mustBeAdmin && membership.role !== MembershipRole.ADMIN) {
		throw new ForbiddenError('User is not an admin of the organization');
	}
}