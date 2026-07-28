import { prisma } from '../../src/lib/prisma';

export async function clearDatabase() {
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
}