import { Router } from 'express';
import { accept, getByOrganization, getForUser, reject, remove, send } from './invitation.controller';

const router = Router();

router.post('/organizations/:organizationId/invitations', send);
router.get('/organizations/:organizationId/invitations', getByOrganization);
router.delete('/organizations/:organizationId/invitations/:userId', remove);
router.get('/invitations', getForUser);
router.post('/invitations/reject', reject);
router.post('/invitations/accept', accept);

export const invitationRoutes = router;