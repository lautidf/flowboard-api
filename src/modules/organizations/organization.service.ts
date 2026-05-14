import { MembershipRole } from '../../../generated/prisma/enums';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/internal/prismaNamespace';
import { ConflictError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';

export async function create(name: string, userId: string) {
	try {
		const organization = await prisma.organization.create({
			data: {
				name,
				memberships: {
					create: {
						userId: userId,
						role: MembershipRole.OWNER,
					},
				},
			},
			select: {
				id: true,
				name: true,
			},
		});

		return organization;
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			throw new ConflictError('An organization with this name already exists');
		}

		throw error;
	}
};

export async function getAll(userId: string) {
	const organizations = await prisma.organization.findMany({
		where: {
			memberships: {
				some: {
					userId: userId,
				},
			},
		},
		select: {
			id: true,
			name: true,
		},
	});

	return organizations;
}

export async function getOne(id: string, userId: string) {
	const organization = await prisma.organization.findFirst({
		where: {
			id,
			memberships: {
				some: {
					userId: userId,
				},
			},
		},
		select: {
			id: true,
			name: true,
			projects: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	return organization;
}

export const organizationService = {
	create,
	getAll,
	getOne,
};