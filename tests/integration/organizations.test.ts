import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';
import { createAuthenticatedUser } from '../helpers/auth';
import { MembershipRole } from '../../src/generated/prisma/enums';

describe('POST /organizations', () => {
  it('creates an organization with the creator as admin', async () => {
    const { token, user } = await createAuthenticatedUser();
    
    const name = 'Test Organization';

    await request(app)
      .post('/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name })
      .expect(201);
    
    const organization = await prisma.organization.findUnique({
      where: { name }
    });

    expect(organization).not.toBeNull();
    if (!organization) return;

    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id
        }
      }
    });

    expect(membership).not.toBeNull();
    expect(membership?.role).toBe(MembershipRole.ADMIN);
  });
});