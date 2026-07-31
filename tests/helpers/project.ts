import { prisma } from '../../src/lib/prisma';
import { randomString } from './random';

export async function createProject(organizationId: string) {
  const name = randomString();
  
  const project = await prisma.project.create({
    data: {
      name,
      organizationId
    }
  });

  return project;
}