import { Request, Response } from 'express';
import { membershipService } from './membership.service.js';
import {
	updateRequestSchema,
	getByOrganizationRequestSchema,
	removeRequestSchema,
	leaveRequestSchema
} from './membership.schemas.js';

export async function update(req: Request, res: Response) {
	const { params, body } = updateRequestSchema.parse({
		params: req.params,
		body: req.body
	});

	const { organizationId, userId: memberId } = params;
	const { role } = body;
	const userId = req.user.id;

	const membership = await membershipService.update({
		organizationId,
		memberId,
		role,
		userId
	});

	res.status(200).json(membership);
}

export async function getByOrganization(req: Request, res: Response) {
	const { params } = getByOrganizationRequestSchema.parse({
		params: req.params
	});

	const { organizationId } = params;
	const userId = req.user.id;

	const memberships = await membershipService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(memberships);
}

export async function remove(req: Request, res: Response) {
	const { params } = removeRequestSchema.parse({ params: req.params });

	const { organizationId, userId: memberId } = params;
	const userId = req.user.id;

	await membershipService.delete({
		organizationId,
		memberId,
		userId
	});

	res.status(204).send();
}

export async function leave(req: Request, res: Response) {
	const { params } = leaveRequestSchema.parse({ params: req.params });
	
	const { organizationId } = params;
	const userId = req.user.id;

	await membershipService.leave(organizationId, userId);

	res.status(204).send();
}