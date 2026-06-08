import { Request, Response } from 'express';
import { authService } from './auth.service';
import {
	registerUserRequestSchema,
	loginRequestSchema
} from './auth.schemas';

export async function registerUser(req: Request, res: Response) {
	const { body } = registerUserRequestSchema.parse({ body: req.body });
	
  const { email, name, password } = body;
 
  const user = await authService.registerUser({ email, name, password });

	res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
	const { body } = loginRequestSchema.parse({ body: req.body });
	
  const { email, password } = body;

  const result = await authService.login({ email, password });

  res.status(200).json(result);
}