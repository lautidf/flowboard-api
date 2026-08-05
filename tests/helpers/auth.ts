import { MembershipRole } from '../../src/generated/prisma/enums.js';
import { generateAccessToken } from '../../src/modules/auth/jwt.js';
import { createMembership } from './membership.js';
import { createUser } from './user.js';

export async function createAuthenticatedUser() {
  const user = await createUser();

  const token = generateAccessToken(user.id, user.email);

  return {
    user,
    token
  };
}

export async function createAuthenticatedMember(
  organizationId: string,
  role?: MembershipRole
) {
  const authenticatedUser = await createAuthenticatedUser();
  
  await createMembership({
    userId: authenticatedUser.user.id,
    organizationId,
    role: role ?? MembershipRole.MEMBER
  });

  return authenticatedUser;
}
