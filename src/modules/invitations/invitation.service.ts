import { MembershipRole } from '../../../generated/prisma/enums';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/internal/prismaNamespace';
import { ConflictError, NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';
import { requireMembership, requireOrganizationExists } from '../organizations/organization.helpers';

type SendInput = {
	organizationId: string;
	email: string;
	role: MembershipRole;
	senderId: string;
};
export async function create({
	organizationId,
	email,
	role,
	senderId
}: SendInput) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		userId: senderId,
		organizationId,
		minimumRole: MembershipRole.ADMIN
	});

	const invitedUser = await prisma.user.findUnique({
		where: { email },
		select: { id: true }
	});
	
	if (!invitedUser) {
		throw new NotFoundError('User not found');
	}

	const membership = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId: invitedUser.id,
				organizationId
			}
		}
	});

	if (membership) {
		throw new ConflictError('User is already a member of the organization');
	}
	
	try {
		const invitation = await prisma.invitation.create({
			data: {
				organizationId,
				invitedUserId: invitedUser.id,
				senderId,
				role
			}
		});

		return invitation;
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			switch (error.code) {
				case 'P2002':
					throw new ConflictError(
						'A pending invitation for this user already exists'
					);
				case 'P2003':
					throw new NotFoundError(
						'Referenced resource no longer exists'
					);
			}
		}

		throw error;
	}
}

export async function getByOrganization(
	organizationId: string,
	userId: string
) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		organizationId,
		userId,
		minimumRole: MembershipRole.ADMIN
	});

	return prisma.invitation.findMany({
		where: { organizationId },
		select: {
			invitedUser: {
				select: {
					id: true,
					email: true,
					name: true
				}
			}
		}
	});
}

type RemoveInput = {
	organizationId: string;
	invitedUserId: string;
	authenticatedUserId: string;
};
export async function remove({
	organizationId,
	invitedUserId,
	authenticatedUserId
}: RemoveInput) {
	await requireOrganizationExists(organizationId);
	await requireMembership({
		organizationId,
		userId: authenticatedUserId,
		minimumRole: MembershipRole.ADMIN
	});

	try {
		await prisma.invitation.delete({
			where: {
				invitedUserId_organizationId: {
					invitedUserId,
					organizationId
				}
			}
		});
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError
			&& error.code === 'P2025'
		) {
			throw new NotFoundError('Invitation not found');
		}

		throw error;
	}
}

export async function getForUser(userId: string) {
	return prisma.invitation.findMany({
		where: { invitedUserId: userId },
		select: {
			invitedUserId: true,
			role: true,
			organization: {
				select: {
					id: true,
					name: true
				}
			},
			sender: {
				select: {
					email: true,
					name: true
				}
			}
		}
	});
}

export async function reject(userId: string, organizationId: string) {
	await prisma.invitation.delete({
		where: {
			invitedUserId_organizationId: {
				invitedUserId: userId,
				organizationId
			}
		}
	});
}

export async function accept(userId: string, organizationId: string) {
	const invitation = await prisma.invitation.findUnique({
		where: {
			invitedUserId_organizationId: {
				invitedUserId: userId,
				organizationId
			}
		},
		select: {
			role: true
		}
	});

	if (!invitation) {
		throw new NotFoundError('Invitation not found');
	}

	try {
		await prisma.$transaction([
			prisma.membership.create({
				data: {
					userId,
					organizationId,
					role: invitation.role
				}
			}),
			prisma.invitation.delete({
				where: {
					invitedUserId_organizationId: {
						invitedUserId: userId,
						organizationId
					}
				}
			})
		]);
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			switch (error.code) {
				case 'P2002':
					throw new ConflictError(
						'User is already a member of the organization'
					);
				case 'P2003':
				case 'P2025':
					throw new NotFoundError(
						'Invitation not found'
					);
			}
		}

		throw error;
	}
}

export const invitationService = {
	create,
	getByOrganization,
	delete: remove,
	getForUser,
	reject,
	accept,
};