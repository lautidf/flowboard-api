import { Request, Response } from 'express';
import { organizationService } from './organization.service';
import {
	createRequestSchema,
	getAllRequestSchema,
	getOneRequestSchema,
	removeRequestSchema
} from './organization.schemas';

export async function create(req: Request, res: Response) {
	const { body } = createRequestSchema.parse({ body: req.body });
	
	const { name } = body;
	const userId = req.user.id;

	const organization = await organizationService.create({ name, userId });

	res.status(201).json(organization);
};

export async function getAll(req: Request, res: Response) {
	const { query } = getAllRequestSchema.parse({
		query: req.query
	});
	
	const { role } = query;
	const userId = req.user.id;

	const organizations = await organizationService.getAll({
		userId,
		role
	});

	res.json(organizations);
}

export async function getOne(req: Request, res: Response) {
	const { params } = getOneRequestSchema.parse({
		params: req.params
	});

	const { organizationId } = params;
	const userId = req.user.id;

	const organization = await organizationService.getOne(
		organizationId,
		userId
	);

	res.json(organization);
}

export async function remove(req: Request, res: Response) {
	const { params } = removeRequestSchema.parse({
		params: req.params
	});

	const { organizationId } = params;
	const { id: userId} = req.user;

	await organizationService.delete(organizationId, userId);

	res.status(204).send();
}