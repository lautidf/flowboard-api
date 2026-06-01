import { Router } from 'express';
import { create, getAll, getOne, remove } from './organization.controller';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.get('/:organizationId', getOne);
router.delete('/:organizationId', remove)

export const organizationRoutes = router;