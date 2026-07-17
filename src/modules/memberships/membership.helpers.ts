import { MembershipRole } from '../../generated/prisma/enums.js';
import { ForbiddenError, NotFoundError } from '../../errors/errors.js';
import { prisma } from '../../lib/prisma.js';

type RequireMembershipInput = {
  userId: string;
  organizationId: string;
  minimumRole?: MembershipRole;
  notMemberErrorMessage?: string;
};
export async function requireMembership({
  userId,
  organizationId,
  minimumRole = MembershipRole.MEMBER,
  notMemberErrorMessage = 'Organization not found'
}: RequireMembershipInput) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new NotFoundError(notMemberErrorMessage);
  }

  if(
    minimumRole === MembershipRole.ADMIN &&
    membership.role !== MembershipRole.ADMIN
  ) {
    throw new ForbiddenError('User is not an admin of the organization');
  }
}