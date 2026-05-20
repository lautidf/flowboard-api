import { Request, Response } from 'express';
import { authService } from './auth.service';

export async function registerUser(req: Request, res: Response) {
  const { email, name, password } = req.body;
 
  const user = await authService.registerUser({ email, name, password });

	res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.status(200).json(result);
}