import { Request, Response } from 'express';
import { userService } from './user.service.js';

export async function deleteMe(req: Request, res: Response) {
  const userId = req.user.id;

  await userService.delete(userId);

  return res.status(204).send();
}