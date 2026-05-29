import { Router } from 'express';
import { getByOrganization, remove, update } from './membership.controller';

const router = Router();

router.get('/organizations/:organizationId/memberships', getByOrganization);
router.patch('/organizations/:organizationId/memberships/:userId', update);
router.delete('/organizations/:organizationId/memberships/:userId', remove);

export const membershipRoutes = router;