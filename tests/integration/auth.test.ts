import request from 'supertest';
import { describe, expect, it } from 'vitest'
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';
import { createUser } from '../helpers/user';

describe('POST /register', () => {
  it('creates a new user', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!'
      })
      .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });

      expect(user).not.toBeNull();
  });

  it('rejects duplicate emails', async () => {
    const existingUser = await createUser({ name: 'Test User 1' })

    const duplicateUserName = 'Test User 2';

    await request(app)
      .post('/register')
      .send({
        email: existingUser.email,
        name: duplicateUserName,
        password: 'Password123!'
      })
      .expect(409)

    const user = await prisma.user.findFirst({
      where: { name: duplicateUserName }
    });

    expect(user).toBeNull();
  });
});

describe('POST /login', () => {
  it('returns a JWT for valid credentials', async () => {
    const password = 'Password123!';

    const user = await createUser({ password });

    const response = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password,
      })
      .expect(200)

    expect(response.body).toHaveProperty('token');
  });

  it('rejects invalid credentials', async () => {
    const validPassword = 'validPassword123!';
    const invalidPassword = 'invalidPassword123!';

    const user = await createUser({ password: validPassword });

    await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: invalidPassword,
      })
      .expect(401)
  });
});