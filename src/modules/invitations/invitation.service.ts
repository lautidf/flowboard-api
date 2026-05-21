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
	requireOrganizationExists(organizationId);
	requireMembership({
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
		if (
			error instanceof PrismaClientKnownRequestError
			&& error.code === 'P2002'
		) {
			throw new ConflictError('A pending invitation for this user already exists');
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

export const invitationService = {
	create,
	getByOrganization,
};