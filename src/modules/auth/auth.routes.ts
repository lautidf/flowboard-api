import { Router } from 'express';
import { login, registerUser } from './auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);

export const authRoutes = router;