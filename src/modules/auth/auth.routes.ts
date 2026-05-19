import { Router } from 'express';
import { registerUser } from './auth.controller';

const router = Router();

router.post('/register', registerUser);

export const authRoutes = router;