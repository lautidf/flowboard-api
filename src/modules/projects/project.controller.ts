import { Request, Response } from 'express';
import { projectService } from './project.service';
import { createRequestSchema } from './project.schemas';

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

type GetByOrganizationParams = { organizationId: string };
export async function getByOrganization(
	req: Request<GetByOrganizationParams>,
	res: Response
) {
	const { organizationId } = req.params;
	const userId = req.user.id;

	const projects = await projectService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(projects);
}

type GetOneParams = {	projectId: string };
export async function getOne(req: Request<GetOneParams>, res: Response) {
	const { projectId } = req.params;
	const userId = req.user.id;

	const project = await projectService.getOne(projectId, userId);

	res.status(200).json(project);
}

type RemoveParams = { projectId: string };
export async function remove(req: Request<RemoveParams>, res: Response) {
	const { projectId } = req.params;
	const userId = req.user.id;

	await projectService.delete(projectId, userId);

	res.status(204).send();
}