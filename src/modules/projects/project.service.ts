import { Request } from 'express';
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
	const membership = await prisma.membership.findFirst({
		where: {
			userId,
			organizationId,
		},
	});

	if (!membership) {
		throw new ForbiddenError('User is not a member of the organization');
	}

	if(membership.role !== MembershipRole.ADMIN) {
		throw new ForbiddenError('User is not an admin of the organization');
	}

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