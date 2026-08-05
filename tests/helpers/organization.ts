import { prisma } from '../../src/lib/prisma.js';
import { randomString } from './random.js';

export async function createOrganization() {
  const name = randomString();
  
  const organization = await prisma.organization.create({ data: { name } });

  return organization;
}
