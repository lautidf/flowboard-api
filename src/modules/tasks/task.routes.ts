import { Router } from 'express';
import { create, getByProject, getOne } from './task.controller';

const router = Router();

router.post('/projects/:projectId/tasks', create);
router.get('/projects/:projectId/tasks', getByProject);
router.get('/tasks/:taskId', getOne);

export const taskRoutes = router;