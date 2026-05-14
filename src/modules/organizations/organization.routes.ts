import { Router } from 'express';
import { create } from './organization.controller';

export const router = Router();

router.post('/', create);

export const organizationRoutes = router;