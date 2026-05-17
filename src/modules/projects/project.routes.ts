import { Router } from 'express';
import { create, getByOrganization, getOne } from './project.controller';

const router = Router();

router.post('/organizations/:id/projects', create);
router.get('/organizations/:id/projects', getByOrganization);
router.get('/projects/:id', getOne);

export const projectRoutes = router;