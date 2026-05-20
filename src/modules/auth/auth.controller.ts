import { Request, Response } from 'express';
import { authService } from './auth.service';

export async function registerUser(req: Request, res: Response) {
  const { email, name, password } = req.body;
 
  const user = await authService.registerUser({ email, name, password });

	res.status(201).json({ user });
}