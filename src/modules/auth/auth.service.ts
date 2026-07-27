import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.js';
import { ConflictError, UnauthorizedError } from '../../errors/errors.js';
import { prisma } from '../../lib/prisma.js';
import argon2 from 'argon2';
import { hashPassword, verifyPassword } from './password.js';
import { generateAccessToken } from './jwt.js';

type RegisterUserInput = {
  email: string;
  name: string;
  password: string;
};
export async function registerUser({
  email,
  name,
  password
}: RegisterUserInput) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictError('User with this email already exists');
    }

    throw error;
  }
};

type LoginInput = {
  email: string;
  password: string;
};
export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const passwordIsCorrect = await verifyPassword(user.passwordHash, password);

  if (!passwordIsCorrect) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = generateAccessToken(user.id, user.email);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    token
  };
}

export const authService = {
  registerUser,
  login,
};