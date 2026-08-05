import { prisma } from '../../src/lib/prisma.js';

export async function clearDatabase() {
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
}
