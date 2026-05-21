import { Request, Response } from 'express';
import { invitationService } from './invitation.service';

type SendInvitationParams = {
	organizationId: string;
};
export async function send(
	req: Request<SendInvitationParams>,
	res: Response
) {
	const { organizationId } = req.params;
	const { email, role } = req.body;
	const { id: senderId } = req.user;

	await invitationService.create({
		organizationId,
		email,
		role,
		senderId
	});

	res.status(201).json({ message: 'Invitation sent successfully' });
}

type GetByOrganizationParams = {
	organizationId: string;
};
export async function getByOrganization(
	req: Request<GetByOrganizationParams>,
	res: Response
) {
	const { organizationId } = req.params;
	const { id: userId } = req.user;

	const invitations = await invitationService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(invitations);
}