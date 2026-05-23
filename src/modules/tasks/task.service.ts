import { MembershipRole, Status } from '../../../generated/prisma/enums';
import { NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';
import { requireMembership } from '../organizations/organization.helpers';

type CreateInput = {
	projectId: string;
	title: string;
	description: string;
	userId: string;
};
export async function create({
	projectId,
	title,
	description,
	userId
}: CreateInput) {
	const project = await prisma.project.findUnique({
		where: {
			id: projectId
		},
		select: {
			organizationId: true
		}
	});

	if (!project) {
		throw new NotFoundError('Project not found');
	}

	await requireMembership({
		organizationId: project.organizationId,
		userId
	});

	const maxPosition = await prisma.task.aggregate({
		where: {
			projectId
		},
		_max: {
			position: true
		}
	});

	const position = (maxPosition._max.position ?? 0) + 100;

	const task = await prisma.task.create({
		data: {
			title,
			description,
			projectId,
			position,
			creatorId: userId
		},
		omit: {
			creatorId: true
		}
	});

	return task;
}

export const taskService = {
	create,
};