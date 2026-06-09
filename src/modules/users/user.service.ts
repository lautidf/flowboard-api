import { MembershipRole } from '../../generated/prisma/enums.js';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.js';
import { ConflictError, NotFoundError } from '../../errors/errors.js';
import { prisma } from '../../lib/prisma.js';

export async function remove(id: string) {
	const adminMembership = await prisma.membership.findFirst({
		where: {
			userId: id,
			role: MembershipRole.ADMIN
		}
	});

	if (adminMembership) {
		throw new ConflictError(
			'Cannot delete user who is admin of an organization'
		);
	}

	try {
		await prisma.user.delete({
			where: {
				id,
			},
		});
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError
			&& error.code === 'P2025'
		) {
			throw new NotFoundError('User not found');
		}

		throw error;
	}
}

export const userService = {
	delete: remove,
};