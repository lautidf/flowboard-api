import { Priority, Status } from '../../src/generated/prisma/enums';
import { prisma } from '../../src/lib/prisma';
import { calculatePosition } from '../../src/modules/tasks/task.helpers';
import { createProject } from './project';
import { randomString } from './random';

type TaskFields = Partial<{
  title: string;
  description: string;
  status: Status;
  priority: Priority;
}>;

type CreateTaskOptions = TaskFields & { projectId: string; };
export async function createTask(options: CreateTaskOptions) {
  const { description, status, priority, projectId } = options;
  
  const title = options.title ?? randomString();
  const position = await calculatePosition(projectId);
  
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      projectId,
      position
    }
  });

  return task;
}

type CreateOnlyTaskOptions = TaskFields & { organizationId: string; };
export async function createOnlyTask(options: CreateOnlyTaskOptions) {
  const { title, description, status, priority, organizationId } = options;

  const project = await createProject(organizationId);

  const task = await createTask({
    title,
    description,
    status,
    priority,
    projectId: project.id
  });

  return task;
}