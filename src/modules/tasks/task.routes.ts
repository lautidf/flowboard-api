import { Router } from 'express';
import { create, getByProject } from './task.controller';

const router = Router();

router.post('/projects/:projectId/tasks', create);
router.get('/projects/:projectId/tasks', getByProject);

export const taskRoutes = router;