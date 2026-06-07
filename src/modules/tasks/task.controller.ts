import { Request, Response } from 'express';
import { taskService } from './task.service';
import {
	createRequestSchema,
	getByProjectRequestSchema,
	getOneRequestSchema,
	removeRequestSchema,
	updateRequestSchema
} from './task.schemas';

export async function create(req: Request, res: Response) {
	const { params, body } = createRequestSchema.parse({
		params: req.params,
		body: req.body
	});

	const { projectId } = params;
	const { title, description } = body;
	const userId = req.user.id;

	const task = await taskService.create({
		projectId,
		title,
		description,
		userId
	});

	res.status(201).json(task);
}

export async function getByProject(req: Request, res: Response) {
	const { params, query } = getByProjectRequestSchema.parse({
		params: req.params,
		query: req.query
	});

	const { projectId } = params;
	const {
		priority,
		assignedToMe,
		unassigned,
	} = query;
	const userId = req.user.id;

	const tasks = await taskService.getByProject({
		projectId,
		userId,
		priority,
		assignedToMe,
		unassigned
	});

	res.status(200).json(tasks);
}

export async function getOne(req: Request, res: Response) {
	const { params } = getOneRequestSchema.parse({
		params: req.params
	});

	const { taskId } = params;
	const userId = req.user.id;

	const task = await taskService.getOne(taskId, userId);

	res.status(200).json(task);
}

export async function update(req: Request, res: Response) {
	const { params, body } = updateRequestSchema.parse({
		params: req.params,
		body: req.body
	});

	const { taskId } = params;
	const {
		title,
		description,
		status,
		priority,
		position,
		assigneeId,
	} = body;
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

export async function remove(req: Request, res: Response) {
	const { params } = removeRequestSchema.parse({
		params: req.params
	});

	const { taskId } = params;
	const userId = req.user.id;

	await taskService.delete(taskId, userId);

	res.status(204).send();
}