import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { createAuthenticatedMember } from '../helpers/auth.js';
import { prisma } from '../../src/lib/prisma.js';
import { createOrganization } from '../helpers/organization.js';
import { MembershipRole } from '../../src/generated/prisma/enums.js';

describe('POST /organizations/:organizationId/projects', () => {
  it('rejects project creation by non-admins', async () => {
    const organization = await createOrganization();
    
    const { token } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.MEMBER
    );
    
    const name = 'Test Project';

    await request(app)
      .post(`/organizations/${organization.id}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name })
      .expect(403)
    
    const project = await prisma.project.findFirst({ where: { name } });
    
    expect(project).toBeNull();
  });
});
