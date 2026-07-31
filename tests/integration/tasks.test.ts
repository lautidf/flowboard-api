import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app';
import { createAuthenticatedMember } from '../helpers/auth';
import { prisma } from '../../src/lib/prisma';
import { createOrganization } from '../helpers/organization';
import { createProject } from '../helpers/project';
import { MembershipRole } from '../../src/generated/prisma/enums';
import { createOnlyTask, createTask } from '../helpers/task';

describe('POST /projects/:projectId/tasks', () => {
  it('creates a task', async () => {
    const organization = await createOrganization();
    const project = await createProject(organization.id);

    const { token } = await createAuthenticatedMember(organization.id);
    
    const title = 'Test Task';
    
    await request(app)
      .post(`/projects/${project.id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title });
    
    const task = await prisma.task.findFirst({ where: { title } });
    
    expect(task).not.toBeNull();
  });
});

describe('PATCH /tasks/:taskId', () => {
  it('rejects title updates by non-admin, non-assignee members', async () => {
    const oldTitle = 'Old Title';
    const newTitle = 'New Title';

    const organization = await createOrganization();
    const { id } = await createOnlyTask({
      title: oldTitle,
      organizationId: organization.id
    });

    const { token } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.MEMBER
    );

    await request(app)
      .patch(`/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: newTitle })
      .expect(403)
    
    const task = await prisma.task.findUnique({ where: { id } });
    
    expect(task?.title).toBe(oldTitle);
  });
});