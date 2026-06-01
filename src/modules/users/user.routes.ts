import { Router } from 'express';
import { deleteMe } from './user.controller';

const router = Router();

router.delete('/me', deleteMe);

export const userRoutes = router;