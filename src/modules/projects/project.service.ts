import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../errors/errors';
import { requireMembership, requireOrganizationExists } from '../organizations/organization.helpers';
import { MembershipRole } from '../../../generated/prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

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

	try {
		const project = await prisma.project.create({
			data: {
				name,
				organizationId
			},
		});

		return project;
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError
			&& error.code === 'P2003'
		) {
			throw new NotFoundError('Organization not found');
		}
		
		throw error;
	}	
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
			id
		},
	});
	
	if (!project) {
		throw new NotFoundError('Project not found');
	}

	await requireMembership({
		userId,
		organizationId: project.organizationId,
	});

	return project;
}

export async function remove(id: string, userId: string) {
	const project = await prisma.project.findUnique({
		where: {
			id
		}
	});

	if (!project) {
		throw new NotFoundError('Project not found');
	}

	await requireMembership({
		userId,
		organizationId: project.organizationId,
		minimumRole: MembershipRole.ADMIN
	});

	await prisma.project.delete({
		where: {
			id
		},
	});
}

export const projectService = {
	create,
	getByOrganization,
	getOne,
	delete: remove,
};