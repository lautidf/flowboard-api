import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app';
import { createAuthenticatedMember, createAuthenticatedUser } from '../helpers/auth';
import { prisma } from '../../src/lib/prisma';
import { createUser } from '../helpers/user';
import { createOrganization } from '../helpers/organization';
import { MembershipRole } from '../../src/generated/prisma/enums';

describe('POST /organizations/:organizationId/invitations', () => {
  it('allows admins to send invitations', async () => {
    const organization = await createOrganization();
    const invitedUser = await createUser();
    const { token } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.ADMIN
    );

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
    const { token } = await createAuthenticatedMember(
      organization.id,
      MembershipRole.MEMBER
    );

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

describe('POST /invitations/:organizationId/accept', () => {
  it('creates a membership', async () => {
    const { user: invitedUser, token } = await createAuthenticatedUser();
    const organization = await createOrganization();
    const sender = await createUser();

    await prisma.invitation.create({
      data: {
        invitedUserId: invitedUser.id,
        organizationId: organization.id,
        senderId: sender.id,
        role: MembershipRole.MEMBER
      }
    });
    
    await request(app)
      .post(`/invitations/${organization.id}/accept`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: invitedUser.id,
          organizationId: organization.id
        }
      }
    });
      
    expect(membership).not.toBeNull();
  });

  it('returns 404 when accepting invitation that does not exist', async () => {
    const { user, token } = await createAuthenticatedUser();
    const organization = await createOrganization();
    
    await request(app)
      .post(`/invitations/${organization.id}/accept`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id
        }
      }
    });
      
    expect(membership).toBeNull();
  });
});