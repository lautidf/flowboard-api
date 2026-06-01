import { Request, Response } from 'express';
import { taskService } from './task.service';
import { Priority } from '../../../generated/prisma/enums';

type CreateParams = {
	projectId: string;
};
export async function create(req: Request<CreateParams>, res: Response) {
	const { projectId } = req.params;
	const { title, description } = req.body;
	const userId = req.user.id;

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
type GetByProjectQuery = {
	priority?: Priority;
	assignedToMe?: string;
	unassigned?: string;
};
export async function getByProject(
	req: Request<GetByProjectParams, {}, {}, GetByProjectQuery>,
	res: Response
) {
	const { projectId } = req.params;
	const {
		priority,
		assignedToMe: assignedToMeStr,
		unassigned: unassignedStr,
	} = req.query;
	const userId = req.user.id;

	const tasks = await taskService.getByProject({
		projectId,
		userId,
		priority,
		assignedToMe: assignedToMeStr === 'true',
		unassigned: unassignedStr === 'true'
	});

	res.status(200).json(tasks);
}

type GetOneParams = {
	taskId: string;
};
export async function getOne(req: Request<GetOneParams>, res: Response) {
	const { taskId } = req.params;
	const userId = req.user.id;

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
	const userId = req.user.id;

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
	const userId = req.user.id;

	await taskService.delete(taskId, userId);

	res.status(204).send();
}