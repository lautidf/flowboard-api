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
	role: updatedRole,
	userId
}: UpdateInput) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		userId,
		organizationId,
		minimumRole: MembershipRole.ADMIN
	});
		
	const currentMembership = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId: memberId,
				organizationId
			}
		}
	});

	if (!currentMembership) {
		throw new NotFoundError('Membership not found');
	}

	const currentRole = currentMembership.role;

	if (updatedRole === currentRole) {
		return currentMembership;
	}

	if (await wouldLeaveNoAdmins(currentRole, organizationId)) {
		throw new ConflictError(
			'The last admin in the organization cannot be demoted'
		);
	}

	try {
		const membership = await prisma.membership.update({
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

	const membership = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId: memberId,
				organizationId
			}
		}
	});
	
	if (!membership) {
		throw new NotFoundError('Membership not found');
	}

	if (await wouldLeaveNoAdmins(membership.role, organizationId)) {
		throw new ConflictError(
			'The last admin in the organization cannot be removed'
		);		
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

	const membership = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId,
				organizationId
			}
		}
	});
	
	if (!membership) {
		throw new NotFoundError('Membership not found');
	}

	if (await wouldLeaveNoAdmins(membership.role, organizationId)) {
		throw new ConflictError(
			'The last admin in the organization cannot leave'
		);
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

async function wouldLeaveNoAdmins(
	role: MembershipRole,
	organizationId: string
) {
	if (role === MembershipRole.ADMIN) {
		const adminCount = await prisma.membership.count({
			where: {
				organizationId,
				role: MembershipRole.ADMIN
			}
		});
			
		return adminCount <= 1;
	}
	return false;
}