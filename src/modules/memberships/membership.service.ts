import { MembershipRole } from '../../../generated/prisma/enums';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/internal/prismaNamespace';
import { ConflictError, NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';
import { requireMembership, requireOrganizationExists } from '../organizations/organization.helpers';

type UpdateInput = {
	organizationId: string;
	memberId: string;
	role: MembershipRole;
	userId: string;
}
export async function update({
	organizationId,
	memberId,
	role,
	userId
}: UpdateInput) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		userId,
		organizationId,
		minimumRole: MembershipRole.ADMIN
	});

	const adminCount = await prisma.membership.count({
		where: {
			organizationId,
			role: MembershipRole.ADMIN
		}
	})

	if (role !== MembershipRole.ADMIN && adminCount < 2) {
		throw new ConflictError(
			'Last admin of the organization cannot be demoted'
		);
	}

	try {
		const membership = prisma.membership.update({
			where: {
				userId_organizationId: {
					userId: memberId,
					organizationId
				}
			},
			data: {
				role
			}
		});

		return membership;
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === 'P2025'
		) {
			throw new NotFoundError('Membership not found');
		}

		throw error;
	}
}

export async function getByOrganization(organizationId: string, userId: string) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		userId,
		organizationId,
		minimumRole: MembershipRole.ADMIN
	});

	const memberships = await prisma.membership.findMany({
		where: {
			organizationId
		}
	});

	return memberships;
}
type RemoveInput = {
	organizationId: string;
	memberId: string;
	userId: string;
}
export async function remove({
	organizationId,
	memberId,
	userId
}: RemoveInput) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		userId,
		organizationId,
		minimumRole: MembershipRole.ADMIN
	});

	const membership = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId: memberId,
				organizationId
			}
		},
		select: {
			role: true
		}
	});

	if (!membership) {
		throw new NotFoundError('Membership not found');
	}

	if (membership.role === MembershipRole.ADMIN) {
		const adminCount = await prisma.membership.count({
			where: {
				organizationId,
				role: MembershipRole.ADMIN
			}
		});
	
		if (adminCount < 2) {
			throw new ConflictError(
				'Last admin of the organization cannot be removed'
			);
		}
	}

	await prisma.membership.delete({
		where: {
			userId_organizationId: {
				userId: memberId,
				organizationId
			}
		}
	});
}

export const membershipService = {
	update,
	getByOrganization,
	delete: remove,
};