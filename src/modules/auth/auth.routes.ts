import { Router } from 'express';
import { login, registerUser } from './auth.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);

export const authRoutes = router;