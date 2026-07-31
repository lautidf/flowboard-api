import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app';
import { createAuthenticatedMember } from '../helpers/auth';
import { prisma } from '../../src/lib/prisma';
import { createMember } from '../helpers/user';
import { createOrganization } from '../helpers/organization';
import { MembershipRole } from '../../src/generated/prisma/enums';

describe('PATCH /organizations/:organizationId/memberships/:userId', () => {
  it('allows admin to change roles', async () => {
    const oldRole = MembershipRole.MEMBER;
    const newRole = MembershipRole.ADMIN;
    
    const organization = await createOrganization();

    const { token: adminToken } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.ADMIN
    );
    const member = await createMember(organization.id, oldRole);
    
    await request(app)
      .patch(`/organizations/${organization.id}/memberships/${member.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: newRole })
      .expect(200);
    
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: member.id,
          organizationId: organization.id
        }
      }
    });
    
    expect(membership?.role).toBe(newRole);
  });
  
  it('prevents non-admin from changing roles', async () => {
    const oldRole = MembershipRole.MEMBER;
    const newRole = MembershipRole.ADMIN;
    
    const organization = await createOrganization();
    const { token: nonAdminToken } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.MEMBER
    );
    const member = await createMember(organization.id, oldRole);
    
    await request(app)
      .patch(`/organizations/${organization.id}/memberships/${member.id}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({ role: newRole })
      .expect(403);
    
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: member.id,
          organizationId: organization.id
        }
      }
    });
    
    expect(membership?.role).toBe(oldRole);
  });

  it('prevents last admin from being demoted', async () => {    
    const organization = await createOrganization();
    const { user: admin, token: adminToken } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.ADMIN
    );
    
    await request(app)
      .patch(`/organizations/${organization.id}/memberships/${admin.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: MembershipRole.MEMBER })
      .expect(409);
    
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: admin.id,
          organizationId: organization.id
        }
      }
    });
    
    expect(membership?.role).toBe(MembershipRole.ADMIN);
  });

  it('prevents last admin from being removed', async () => {    
    const organization = await createOrganization();
    const { user: admin, token: adminToken } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.ADMIN
    );
    
    await request(app)
      .delete(`/organizations/${organization.id}/memberships/${admin.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);
    
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: admin.id,
          organizationId: organization.id
        }
      }
    });
    
    expect(membership).not.toBeNull();
  });

  it('prevents last admin from leaving', async () => {    
    const organization = await createOrganization();
    const { user: admin, token: adminToken } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.ADMIN
    );
    
    await request(app)
      .delete(`/organizations/${organization.id}/membership`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);
    
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: admin.id,
          organizationId: organization.id
        }
      }
    });
    
    expect(membership).not.toBeNull();
  });
});