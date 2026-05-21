import { Router } from 'express';
import { getByOrganization, send } from './invitation.controller';

const router = Router();

router.post('/organizations/:organizationId/invitations', send);
router.get('/organizations/:organizationId/invitations', getByOrganization);

export const invitationRoutes = router;