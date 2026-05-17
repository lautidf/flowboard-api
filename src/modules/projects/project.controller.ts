import { Request, Response } from 'express';
import { projectService } from './project.service';

type CreateParams = { id: string };
export async function create(req: Request<CreateParams>, res: Response) {
	const { id: organizationId } = req.params;
	const { name } = req.body;
	const userId = req.user.id;

	const project = await projectService.create({
		name,
		organizationId,
		userId,
	});

	res.status(201).json(project);
}

type GetByOrganizationParams = { id: string };
export async function getByOrganization(
	req: Request<GetByOrganizationParams>,
	res: Response
) {
	const { id: organizationId } = req.params;
	const userId = req.user.id;

	const projects = await projectService.getByOrganization(
		organizationId,
		userId
	);

	res.status(200).json(projects);
}

export const projectController = {
	create,
	getByOrganization,
};