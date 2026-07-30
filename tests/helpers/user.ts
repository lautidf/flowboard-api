import { MembershipRole } from '../../src/generated/prisma/enums';
import { prisma } from '../../src/lib/prisma';
import { hashPassword } from '../../src/modules/auth/password';
import { createMembership } from './membership';
import { randomString } from './random';

type CreateUserOptions = Partial<{
  email: string;
  name: string;
  password: string;
}>
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