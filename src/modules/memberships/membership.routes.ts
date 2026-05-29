import { Router } from 'express';
import { getByOrganization, update } from './membership.controller';

const router = Router();

router.get('/organizations/:organizationId/memberships', getByOrganization);
router.patch('/organizations/:organizationId/memberships/:userId', update);

export const membershipRoutes = router;