import { Router } from 'express';
import { create, getByOrganization } from './project.controller';

const router = Router();

router.post('/organizations/:id/projects', create);
router.get('/organizations/:id/projects', getByOrganization);

export const projectRoutes = router;