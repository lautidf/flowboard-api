import { Router } from 'express';
import { create, getByOrganization, getOne, remove } from './project.controller';

const router = Router();

router.post('/organizations/:organizationId/projects', create);
router.get('/organizations/:organizationId/projects', getByOrganization);
router.get('/projects/:projectId', getOne);
router.delete('/projects/:projectId', remove);

export const projectRoutes = router;