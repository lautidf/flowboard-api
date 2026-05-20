import { PrismaClientKnownRequestError } from '../../../generated/prisma/internal/prismaNamespace';
import { ConflictError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';
import argon2 from 'argon2';

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
	if (await prisma.user.findUnique({ where: { email } })) {
		throw new ConflictError('User with this email already exists');
	}

	const passwordHash = await argon2.hash(password);

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

export const authService = {
  registerUser,
};