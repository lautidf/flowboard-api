import { Request, Response } from 'express';
import { invitationService } from './invitation.service';
import {
	acceptRequestSchema,
	getByOrganizationRequestSchema,
	rejectRequestSchema,
	sendRequestSchema,
	removeRequestSchema
} from './invitation.schemas';

export async function send(req: Request, res: Response) {
	const { params, body } = sendRequestSchema.parse({
		params: req.params,
		body: req.body
	});
	
	const { organizationId } = params;
	const { email, role } = body;
	const senderId = req.user.id;

	await invitationService.create({
		organizationId,
		email,
		role,
		senderId
	});

	res.status(201).json({ message: 'Invitation sent successfully' });
}

export async function getByOrganization(req: Request,	res: Response) {
	const { params } = getByOrganizationRequestSchema.parse({
		params: req.params
	});

	const { organizationId } = params;
	const userId = req.user.id;

	const invitations = await invitationService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(invitations);
}

export async function remove(req: Request, res: Response) {
	const { params } = removeRequestSchema.parse({ params: req.params });

	const { organizationId, userId: invitedUserId } = params;
	const authenticatedUserId = req.user.id;

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
	const { body } = rejectRequestSchema.parse({ body: req.body });

	const { organizationId } = body;
	const userId = req.user.id;

	await invitationService.reject(userId, organizationId);

	res.status(204).send();
}

export async function accept(req: Request, res: Response) {
	const { body } = acceptRequestSchema.parse({ body: req.body });
	
	const { organizationId } = body;
	const userId = req.user.id;

	await invitationService.accept(userId, organizationId);

	res.status(204).send();
}