import { Request, Response } from 'express';
import { projectService } from './project.service';

export async function create(req: Request, res: Response) {
	const { name, organizationId } = req.body;
	const userId = req.user.id;

	const project = await projectService.create({
		name,
		organizationId,
		userId,
	});

	res.status(201).json(project);
}