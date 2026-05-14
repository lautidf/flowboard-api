import { Request, Response } from 'express';
import { organizationService } from './organization.service';

export async function create(req: Request, res: Response) {
	const { name } = req.body;
	const userId = req.user.id;
	const organization = await organizationService.create(name, userId);
	res.status(201).json(organization);
};