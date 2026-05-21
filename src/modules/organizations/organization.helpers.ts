import { MembershipRole } from '../../../generated/prisma/enums';
import { ForbiddenError, NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';

export async function requireOrganizationExists(id: string) {
	const organization = await prisma.organization.findUnique({
		where: {
			id
		}
	});

	if (!organization) {
		throw new NotFoundError('Organization not found');
	}
}

export async function requireMembership(
	userId: string,
	organizationId: string,
	mustBeAdmin = false
) {
	const membership = await prisma.membership.findUnique({
		where: {
			userId_organizationId: {
				userId,
				organizationId,
			},
		},
	});

	if (!membership) {
		throw new ForbiddenError('User is not a member of the organization');
	}

	if(mustBeAdmin && membership.role !== MembershipRole.ADMIN) {
		throw new ForbiddenError('User is not an admin of the organization');
	}
}