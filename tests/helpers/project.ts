import { prisma } from '../../src/lib/prisma.js';
import { randomString } from './random.js';

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
