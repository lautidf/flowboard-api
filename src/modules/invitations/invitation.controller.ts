import { Request, Response } from 'express';
import { invitationService } from './invitation.service';

type SendParams = {
	organizationId: string;
};
export async function send(
	req: Request<SendParams>,
	res: Response
) {
	const { organizationId } = req.params;
	const { email, role } = req.body;
	const senderId = req.user.id;

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
	const userId = req.user.id;

	const invitations = await invitationService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(invitations);
}

type RemoveParams = {
	organizationId: string;
	userId: string;
};
export async function remove(
	req: Request<RemoveParams>,
	res: Response
) {
	const { organizationId, userId: invitedUserId } = req.params;
	const { id: authenticatedUserId } = req.user;

	await invitationService.delete({
		organizationId,
		invitedUserId,
		authenticatedUserId
	});

	res.status(204).send();
}

export async function getForUser(req: Request, res: Response) {
	const userId = req.user.id;

	const invitations = await invitationService.getForUser(userId);

	res.status(200).json(invitations);
}

export async function reject(req: Request, res: Response) {
	const { organizationId } = req.body;
	const userId = req.user.id;

	await invitationService.reject(userId, organizationId);

	res.status(204).send();
}

export async function accept(req: Request, res: Response) {
	const { organizationId } = req.body;
	const userId = req.user.id;

	await invitationService.accept(userId, organizationId);

	res.status(204).send();
}