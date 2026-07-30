import { MembershipRole } from '../../src/generated/prisma/enums';
import { generateAccessToken } from '../../src/modules/auth/jwt';
import { createMembership } from './membership';
import { createUser } from './user';

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
  role: MembershipRole
) {
  const authenticatedUser = await createAuthenticatedUser();
  
  await createMembership({
    userId: authenticatedUser.user.id,
    organizationId,
    role
  });

  return authenticatedUser;
}