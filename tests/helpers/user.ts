import { MembershipRole } from '../../src/generated/prisma/enums.js';
import { prisma } from '../../src/lib/prisma.js';
import { hashPassword } from '../../src/modules/auth/password.js';
import { createMembership } from './membership.js';
import { randomString } from './random.js';

type CreateUserOptions = Partial<{
  email: string;
  name: string;
  password: string;
}>;
export async function createUser(options: CreateUserOptions = {}) {
  const email = options.email ?? `${randomString()}@example.com`;
  const name = options.name ?? 'Test User';
  const passwordHash = await hashPassword(options.password ?? 'Password123!');

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    }
  });
  
  return user;
}

export async function createMember(
  organizationId: string,
  role: MembershipRole
) {
  const user = await createUser();
  
  await createMembership({
    userId: user.id,
    organizationId,
    role
  });

  return user;
}
