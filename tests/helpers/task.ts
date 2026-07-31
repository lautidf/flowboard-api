import { Priority, Status } from '../../src/generated/prisma/enums';
import { prisma } from '../../src/lib/prisma';
import { calculatePosition } from '../../src/modules/tasks/task.helpers';
import { createProject } from './project';
import { randomString } from './random';

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