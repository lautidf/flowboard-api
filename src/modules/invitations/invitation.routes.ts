import { Router } from 'express';
import { getByOrganization, remove, send } from './invitation.controller';

const router = Router();

router.post('/organizations/:organizationId/invitations', send);
router.get('/organizations/:organizationId/invitations', getByOrganization);
router.delete('/organizations/:organizationId/invitations/:userId', remove);

export const invitationRoutes = router;