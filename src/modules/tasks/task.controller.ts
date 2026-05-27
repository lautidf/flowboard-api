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

type GetByProjectParams = {
	projectId: string;
};
export async function getByProject(
	req: Request<GetByProjectParams>,
	res: Response
) {
	const { projectId } = req.params;
	const { id: userId } = req.user;

	const tasks = await taskService.getByProject(projectId, userId);

	res.status(200).json(tasks);
}

type GetOneParams = {
	taskId: string;
};
export async function getOne(req: Request<GetOneParams>, res: Response) {
	const { taskId } = req.params;
	const { id: userId } = req.user;

	const task = await taskService.getOne(taskId, userId);

	res.status(200).json(task);
}

type UpdateParams = {
	taskId: string;
};
export async function update(req: Request<UpdateParams>, res: Response) {
	const { taskId } = req.params;
	const {
		title,
		description,
		status,
		priority,
		position,
		assigneeId,
	} = req.body;
	const { id: userId } = req.user;

	const task = await taskService.update({
		taskId,
		title,
		description,
		status,
		priority,
		position,
		assigneeId,
		userId
	});

	res.status(200).json(task);
}

type RemoveParams = {
	taskId: string;
};
export async function remove(req: Request<RemoveParams>, res: Response) {
	const { taskId } = req.params;
	const { id: userId } = req.user;

	await taskService.delete(taskId, userId);

	res.status(204).send();
}