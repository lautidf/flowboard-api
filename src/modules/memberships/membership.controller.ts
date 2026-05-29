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