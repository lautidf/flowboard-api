import { Priority, Status } from '../../src/generated/prisma/enums.js';
import { prisma } from '../../src/lib/prisma.js';
import { calculatePosition } from '../../src/modules/tasks/task.helpers.js';
import { createProject } from './project.js';
import { randomString } from './random.js';

type TaskFields = Partial<{
  title: string;
  assigneeId: string;
}>;

type CreateTaskOptions = TaskFields & { projectId: string; };
export async function createTask(options: CreateTaskOptions) {
  const {
    assigneeId,
    projectId,
  } = options;
  
  const title = options.title ?? randomString();
  const position = await calculatePosition(projectId);
  
  const task = await prisma.task.create({
    data: {
      title,
      projectId,
      assigneeId,
      position,
    }
  });

  return task;
}

type CreateOnlyTaskOptions = TaskFields & { organizationId: string; };
export async function createOnlyTask(options: CreateOnlyTaskOptions) {
  const {
    title,
    assigneeId,
    organizationId,
  } = options;

  const project = await createProject(organizationId);

  const task = await createTask({
    title,
    assigneeId,
    projectId: project.id,
  });

  return task;
}
