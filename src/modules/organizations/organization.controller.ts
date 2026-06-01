import { Request, Response } from 'express';
import { organizationService } from './organization.service';
import { MembershipRole } from '../../../generated/prisma/enums';

export async function create(req: Request, res: Response) {
	const { name } = req.body;
	const userId = req.user.id;

	const organization = await organizationService.create({ name, userId });

	res.status(201).json(organization);
};

type GetAllQuery = {
	role?: MembershipRole;
};
export async function getAll(req: Request<{}, {}, {}, GetAllQuery>, res: Response) {
	const userId = req.user.id;
	const { role } = req.query;

	const organizations = await organizationService.getAll({
		userId,
		role
	});

	res.json(organizations);
}

type GetOneParams = { organizationId: string };
export async function getOne(req: Request<GetOneParams>, res: Response) {
	const { organizationId } = req.params;
	const userId = req.user.id;

	const organization = await organizationService.getOne(organizationId, userId);

	res.json(organization);
}

type RemoveParams = { organizationId: string };
export async function remove(req: Request<RemoveParams>, res: Response) {
	const { organizationId } = req.params;
	const { id: userId} = req.user;

	await organizationService.delete(organizationId, userId);

	res.status(204).send();
}