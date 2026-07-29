import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';
import { createAuthenticatedUser } from '../helpers/auth';

describe('POST /organizations', () => {
  it('creates an organization', async () => {
    const { token } = await createAuthenticatedUser();
    
    const name = 'Test Organization';

    await request(app)
      .post('/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name })
      .expect(201);
    
    const organization = prisma.organization.findUnique({
      where: { name }
    });

    expect(organization).not.toBeNull();
  });
});