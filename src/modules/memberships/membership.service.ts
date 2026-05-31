import { MembershipRole } from '../../../generated/prisma/enums';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/internal/prismaNamespace';
import { ConflictError, NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';
import { requireMembership, requireOrganizationExists } from '../organizations/organization.helpers';
import { organizationRoutes } from '../organizations/organization.routes';
import { getAdminCount, getMembership } from './membership.helpers';

type UpdateInput = {
	organizationId: string;
	memberId: string;
	role: MembershipRole;
	userId: string;
}
export async function update({
	organizationId,
	memberId,
	role: updatedRole,
	userId
}: UpdateInput) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		userId,
		organizationId,
		minimumRole: MembershipRole.ADMIN
	});

	const currentMembership = await getMembership(organizationId, memberId);
	const currentRole = currentMembership.role;

	if (updatedRole === currentRole) {
		return currentMembership;
	}

	if (currentRole === MembershipRole.ADMIN) {
		const adminCount = await getAdminCount(organizationId);
			
		if (adminCount <= 1) {
			throw new ConflictError(
				'The last admin in the organization cannot be demoted'
			);
		}
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
				role: updatedRole
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

	const { role } = await getMembership(organizationId, memberId);

	if (role === MembershipRole.ADMIN) {
		const adminCount = await getAdminCount(organizationId);
			
		if (adminCount <= 1) {
			throw new ConflictError(
				'The last admin in the organization cannot be removed'
			);
		}
	}

	try {
		await prisma.membership.delete({
			where: {
				userId_organizationId: {
					userId: memberId,
					organizationId
				}
			}
		});
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

export async function leave(organizationId: string, userId: string) {
	await requireOrganizationExists(organizationId);
	await requireMembership({ userId, organizationId });

	const { role } = await getMembership(organizationId, userId);

	if (role === MembershipRole.ADMIN) {
		const adminCount = await getAdminCount(organizationId);
			
		if (adminCount <= 1) {
			throw new ConflictError(
				'The last admin in the organization cannot leave'
			);
		}
	}

	try {
		await prisma.membership.delete({
			where: {
				userId_organizationId: {
					userId,
					organizationId
				}
			}
		});
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

export const membershipService = {
	update,
	getByOrganization,
	delete: remove,
	leave,
};