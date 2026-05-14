import { Router } from 'express';
import { create, getAll, getOne } from './organization.controller';

const router = Router();

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);

export const organizationRoutes = router;