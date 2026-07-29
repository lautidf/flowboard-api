import { prisma } from '../../src/lib/prisma';
import { randomString } from './random';

export async function createOrganization() {
  const name = randomString();
  
  const organization = await prisma.organization.create({ data: { name } });

  return organization;
}