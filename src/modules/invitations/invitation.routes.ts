import { Router } from 'express';
import { getByOrganization, getForUser, remove, send } from './invitation.controller';

const router = Router();

router.post('/organizations/:organizationId/invitations', send);
router.get('/organizations/:organizationId/invitations', getByOrganization);
router.delete('/organizations/:organizationId/invitations/:userId', remove);
router.get('/invitations', getForUser)

export const invitationRoutes = router;