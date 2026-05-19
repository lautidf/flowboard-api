import { Request, Response } from 'express';
import { organizationService } from './organization.service';

export async function create(req: Request, res: Response) {
	const { name } = req.body;
	const userId = req.user.id;

	const organization = await organizationService.create({ name, userId });

	res.status(201).json(organization);
};

export async function getAll(req: Request, res: Response) {
	const userId = req.user.id;
	
	const organizations = await organizationService.getAll(userId);

	res.json(organizations);
}

type GetOneParams = { organizationId: string };
export async function getOne(req: Request<GetOneParams>, res: Response) {
	const { organizationId } = req.params;
	const userId = req.user.id;

	const organization = await organizationService.getOne(organizationId, userId);

	res.json(organization);
}