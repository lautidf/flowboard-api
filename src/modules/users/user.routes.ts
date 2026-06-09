import { Router } from 'express';
import { deleteMe } from './user.controller.js';

const router = Router();

router.delete('/me', deleteMe);

export const userRoutes = router;