import { MembershipRole } from '../../src/generated/prisma/enums.js';
import { prisma } from '../../src/lib/prisma.js';

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
