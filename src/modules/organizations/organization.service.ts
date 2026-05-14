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
						userId,
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

export const organizationService = {
	create,
};