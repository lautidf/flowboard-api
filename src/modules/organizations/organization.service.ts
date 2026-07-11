import { MembershipRole } from '../../generated/prisma/enums.js';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.js';
import { ConflictError, NotFoundError } from '../../errors/errors.js';
import { prisma } from '../../lib/prisma.js';
import { requireMembership } from '../memberships/membership.helpers.js';

type CreateInput = {
	name: string;
	userId: string;
};
export async function create({ name, userId }: CreateInput) {
	try {
		const organization = await prisma.organization.create({
			data: {
				name,
				memberships: {
					create: {
						userId: userId,
						role: MembershipRole.ADMIN,
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
		if (error instanceof PrismaClientKnownRequestError) {
			switch (error.code) {
				case 'P2002':
					throw new ConflictError(
						'An organization with this name already exists'
					);
				case 'P2003':
					throw new NotFoundError(
						'User not found'
					);
			}
		}

		throw error;
	}
};

type GetAllInput = {
	userId: string;
	role?: MembershipRole;
};
export async function getAll({ userId, role }: GetAllInput) {
	const organizations = await prisma.organization.findMany({
		where: {
			memberships: {
				some: {
					userId,
					role,
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
					userId,
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
	
	if (!organization) {
		throw new NotFoundError('Organization not found');
	}

	return organization;
}

export async function remove(id: string, userId: string) {
	await requireMembership({
		userId,
		organizationId: id,
		minimumRole: MembershipRole.ADMIN
	});

	try {
		await prisma.organization.delete({
			where: {
				id
			}
		});
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError
			&& error.code === 'P2025'
		) {
			throw new NotFoundError('Organization not found');
		}

		throw error;
	}
}

export const organizationService = {
	create,
	getAll,
	getOne,
	delete: remove,
};