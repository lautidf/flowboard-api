import { Router } from 'express';
import { create, getByProject, getOne, update } from './task.controller';

const router = Router();

router.post('/projects/:projectId/tasks', create);
router.get('/projects/:projectId/tasks', getByProject);
router.get('/tasks/:taskId', getOne);
router.patch('/tasks/:taskId', update);

export const taskRoutes = router;