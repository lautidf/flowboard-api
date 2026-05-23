import { Request, Response } from 'express';
import { taskService } from './task.service';

type CreateParams = {
	projectId: string;
};
export async function create(req: Request<CreateParams>, res: Response) {
	const { projectId } = req.params;
	const { title, description } = req.body;
	const { id: userId } = req.user;

	const task = await taskService.create({
		projectId,
		title,
		description,
		userId
	});

	res.status(201).json(task);
}