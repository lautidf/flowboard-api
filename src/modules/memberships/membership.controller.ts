import { Request, Response } from 'express';
import { membershipService } from './membership.service';

type UpdateParams = {
	organizationId: string;
	userId: string;
}
export async function update(req: Request<UpdateParams>, res: Response) {
	const { organizationId, userId: memberId } = req.params;
	const { role } = req.body;
	const { id: userId } = req.user;

	const membership = await membershipService.update({
		organizationId,
		memberId,
		role,
		userId
	});

	res.status(200).json(membership);
}

type GetByOrganizationParams = {
	organizationId: string;
}
export async function getByOrganization(
	req: Request<GetByOrganizationParams>,
	res: Response
) {
	const { organizationId } = req.params;
	const { id: userId } = req.user;

	const memberships = await membershipService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(memberships);
}

type RemoveParams = {
	organizationId: string;
	userId: string;
}
export async function remove(req: Request<RemoveParams>, res: Response) {
	const { organizationId, userId: memberId } = req.params;
	const { id: userId } = req.user;

	await membershipService.delete({
		organizationId,
		memberId,
		userId
	});

	res.status(204).send();
}

type LeaveParams = {
	organizationId: string
}
export async function leave(req: Request<LeaveParams>, res: Response) {
	const { organizationId } = req.params;
	const { id: userId } = req.user;

	await membershipService.leave(organizationId, userId);

	res.status(204).send();;
}