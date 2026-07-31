import { prisma } from '../../lib/prisma.js';

export async function calculatePosition(projectId: string) {
  const maxPosition = await prisma.task.aggregate({
    where: {
      projectId
    },
    _max: {
      position: true
    }
  });

  const position = (maxPosition._max.position ?? 0) + 100;

  return position;
}