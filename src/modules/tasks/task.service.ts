import { MembershipRole, Status } from '../../../generated/prisma/enums';
import { NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';
import { requireMembership } from '../organizations/organization.helpers';
import { getOrganizationId } from '../projects/project.helpers';

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
	const organizationId = await getOrganizationId(projectId);

	await requireMembership({
		organizationId,
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

export async function getByProject(projectId: string, userId: string) {
	const organizationId = await getOrganizationId(projectId);

	await requireMembership({
		organizationId,
		userId
	});
	
	const tasks = await prisma.task.findMany({
		where: {
			projectId
		},
		orderBy: {
			position: 'asc'
		},
		omit: {
			creatorId: true
		}
	});

	return tasks;
}

export const taskService = {
	create,
	getByProject,
};