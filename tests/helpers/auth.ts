import { generateAccessToken } from '../../src/modules/auth/jwt';
import { createUser } from './user';

export async function createAuthenticatedUser() {
  const user = await createUser();

  const token = generateAccessToken(user.id, user.email);

  return {
    user,
    token
  };
}