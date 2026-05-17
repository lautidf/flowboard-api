import { Router } from 'express';
import { create, getAll, getOne } from './organization.controller';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);

export const organizationRoutes = router;