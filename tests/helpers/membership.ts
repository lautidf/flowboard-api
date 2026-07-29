import { MembershipRole } from '../../src/generated/prisma/enums';
import { prisma } from '../../src/lib/prisma';

type CreateMembershipOptions = {
  userId: string;
  organizationId: string;
  role?: MembershipRole;
}
export async function createMembership({
  userId,
  organizationId,
  role = MembershipRole.MEMBER
}: CreateMembershipOptions) {
  const membership = await prisma.membership.create({
    data: {
      userId,
      organizationId,
      role
    }
  });
  
  return membership;
}