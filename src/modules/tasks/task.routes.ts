import { Router } from 'express';
import { create } from './task.controller';

const router = Router();

router.post('/projects/:projectId/tasks', create);

export const taskRoutes = router;