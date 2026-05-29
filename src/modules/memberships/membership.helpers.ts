import { MembershipRole } from '../../../generated/prisma/enums';
import { NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';

export async function getMembership(organizationId: string, userId: string) {
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

	return membership;
}

export async function getAdminCount(organizationId: string) {
	const adminCount = await prisma.membership.count({
		where: {
			organizationId,
			role: MembershipRole.ADMIN
		}
	});

	return adminCount;
}