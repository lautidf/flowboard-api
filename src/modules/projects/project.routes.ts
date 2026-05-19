import { Router } from 'express';
import { create, getByOrganization, getOne } from './project.controller';

const router = Router();

router.post('/organizations/:organizationId/projects', create);
router.get('/organizations/:organizationId/projects', getByOrganization);
router.get('/projects/:projectId', getOne);

export const projectRoutes = router;