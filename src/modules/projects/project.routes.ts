import { Router } from 'express';
import { create, getByOrganization } from './project.controller';

const router = Router();

router.post('/', create);
router.get('/', getByOrganization);

export const projectRoutes = router;