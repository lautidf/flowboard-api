import { Request, Response } from 'express';
import { organizationService } from './organization.service';

export async function create(req: Request, res: Response) {
	const { name } = req.body;
	const userId = req.user.id;

	const organization = await organizationService.create(name, userId);

	res.status(201).json(organization);
};

export async function getAll(req: Request, res: Response) {
	const userId = req.user.id;
	
	const organizations = await organizationService.getAll(userId);

	res.json(organizations);
}

type GetOneRequest = Request<{ id: string }>;
export async function getOne(req: GetOneRequest, res: Response) {
	const { id } = req.params;
	const userId = req.user.id;

	const organization = await organizationService.getOne(id, userId);

	res.json(organization);
}