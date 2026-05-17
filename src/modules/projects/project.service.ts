import { prisma } from '../../lib/prisma';
import { MembershipRole } from '../../../generated/prisma/enums';
import { ForbiddenError, NotFoundError } from '../../errors/errors';

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
	await checkOrganizationExists(organizationId);
	await requireMembership(userId, organizationId, true);

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
	await checkOrganizationExists(organizationId);
	await requireMembership(userId, organizationId);

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

async function checkOrganizationExists(organizationId: string) {
	const organization = await prisma.organization.findUnique({
		where: {
			id: organizationId,
		},
	});

	if (!organization) {
		throw new NotFoundError('Organization not found');
	}
}

async function requireMembership(
	userId: string,
	organizationId: string,
	mustBeAdmin = false
) {
	const membership = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId,
				organizationId,
			},
		},
	});

	if (!membership) {
		throw new ForbiddenError('User is not a member of the organization');
	}

	if(mustBeAdmin && membership.role !== MembershipRole.ADMIN) {
		throw new ForbiddenError('User is not an admin of the organization');
	}
}