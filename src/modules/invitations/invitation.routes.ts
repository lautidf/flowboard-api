import { Router } from 'express';
import { send } from './invitation.controller';

const router = Router();

router.post('/organizations/:organizationId/invitations', send);

export const invitationRoutes = router;