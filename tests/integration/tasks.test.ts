import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { createAuthenticatedMember } from '../helpers/auth.js';
import { prisma } from '../../src/lib/prisma.js';
import { createOrganization } from '../helpers/organization.js';
import { createProject } from '../helpers/project.js';
import { MembershipRole } from '../../src/generated/prisma/enums.js';
import { createOnlyTask } from '../helpers/task.js';

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
      .expect(403);
    
    const task = await prisma.task.findUnique({ where: { id } });
    
    expect(task?.title).toBe(oldTitle);
  });

  it('rejects reassignment by non-admins', async () => {
    const organization = await createOrganization();

    const { user: assignee, token } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.MEMBER
    );

    const { id } = await createOnlyTask({
      organizationId: organization.id,
      assigneeId: assignee.id
    });

    await request(app)
      .patch(`/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ assigneeId: null })
      .expect(403);
    
    const task = await prisma.task.findUnique({ where: { id } });
    
    expect(task?.assigneeId).toBe(assignee.id);
  });
});
