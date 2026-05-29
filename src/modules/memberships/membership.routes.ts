import { Router } from 'express';
import { update } from './membership.controller';

const router = Router();

router.patch('/organizations/:organizationId/memberships/:userId', update)

export const membershipRoutes = router;