import { Request, Response } from 'express';
import { projectService } from './project.service.js';
import {
	createRequestSchema,
	getByOrganizationRequestSchema,
	getOneRequestSchema,
	removeRequestSchema
} from './project.schemas.js';

export async function create(req: Request, res: Response) {
	const { params, body } = createRequestSchema.parse({
		params: req.params,
		body: req.body
	});

	const { organizationId } = params;
	const { name } = body;
	const userId = req.user.id;

	const project = await projectService.create({
		name,
		organizationId,
		userId,
	});

	res.status(201).json(project);
}

export async function getByOrganization(req: Request, res: Response) {
	const { params } = getByOrganizationRequestSchema.parse({
		params: req.params
	});
	
	const { organizationId } = params;
	const userId = req.user.id;

	const projects = await projectService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(projects);
}

export async function getOne(req: Request, res: Response) {
	const { params } = getOneRequestSchema.parse({
		params: req.params
	});

	const { projectId } = params;
	const userId = req.user.id;

	const project = await projectService.getOne(projectId, userId);

	res.status(200).json(project);
}

export async function remove(req: Request, res: Response) {
	const { params } = removeRequestSchema.parse({
		params: req.params
	});

	const { projectId } = params;
	const userId = req.user.id;

	await projectService.delete(projectId, userId);

	res.status(204).send();
}