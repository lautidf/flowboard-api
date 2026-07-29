import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app';
import { createAuthenticatedUser } from '../helpers/auth';
import { prisma } from '../../src/lib/prisma';
import { createUser } from '../helpers/user';
import { createOrganization } from '../helpers/organization';
import { createMembership } from '../helpers/membership';
import { MembershipRole } from '../../src/generated/prisma/enums';

describe('POST /organizations/:organizationId/invitations', () => {
  it('allows admins to send invitations', async () => {
    const organization = await createOrganization();
    const invitedUser = await createUser();
    const { user: admin, token } = await createAuthenticatedUser();
    await createMembership({
      userId: admin.id,
      organizationId: organization.id,
      role: MembershipRole.ADMIN
    });

    await request(app)
      .post(`/organizations/${organization.id}/invitations`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: invitedUser.email })
      .expect(201);

    const invitation = await prisma.invitation.findUnique({
      where: {
        invitedUserId_organizationId: {
          invitedUserId: invitedUser.id,
          organizationId: organization.id
        }
      }
    });
    
    expect(invitation).not.toBeNull();
  });

  it('rejects invitations from non-admins', async () => {
    const organization = await createOrganization();
    const invitedUser = await createUser();
    const { user: nonAdmin, token } = await createAuthenticatedUser();
    await createMembership({
      userId: nonAdmin.id,
      organizationId: organization.id,
      role: MembershipRole.MEMBER
    });

    await request(app)
      .post(`/organizations/${organization.id}/invitations`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: invitedUser.email })
      .expect(403);

    const invitation = await prisma.invitation.findUnique({
      where: {
        invitedUserId_organizationId: {
          invitedUserId: invitedUser.id,
          organizationId: organization.id
        }
      }
    });
    
    expect(invitation).toBeNull();
  });
});