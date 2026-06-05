import { MembershipRole, Priority, Status } from '../../../generated/prisma/enums';
import { ConflictError, ForbiddenError, NotFoundError } from '../../errors/errors';
import { prisma } from '../../lib/prisma';
import { requireMembership } from '../organizations/organization.helpers';
import { getOrganizationId } from '../projects/project.helpers';

type CreateInput = {
	projectId: string;
	title: string;
	description?: string;
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

type GetByProjectInput = {
	projectId: string;
	userId: string;
	priority?: Priority;
	assignedToMe?: boolean;
	unassigned?: boolean;
};
export async function getByProject({
	projectId,
	userId,
	priority,
	assignedToMe,
	unassigned
}: GetByProjectInput) {
	if (assignedToMe && unassigned) {
		throw new ConflictError(
			'Cannot filter tasks by both assignedToMe and unassigned'
		);
	}
	
	const organizationId = await getOrganizationId(projectId);

	await requireMembership({
		organizationId,
		userId
	});
	
	const tasks = await prisma.task.findMany({
		where: {
			projectId,
			priority,
			assigneeId: assignedToMe
				? userId
				: unassigned ? null : undefined
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

export async function getOne(taskId: string, userId: string) {
	const task = await prisma.task.findUnique({
		where: {
			id: taskId
		},
		include: {
			project: {
				select: {
					organizationId: true
				}
			}
		}
	});

	if (!task) {
		throw new NotFoundError('Task not found');
	}

	await requireMembership({
		organizationId: task.project.organizationId,
		userId
	});

	const { project, ...taskWithoutProject } = task;

	return taskWithoutProject;
}

type UpdateInput = {
	taskId: string;
	title?: string;
	description?: string;
	status?: Status;
	priority?: Priority;
	position?: number;
	assigneeId?: string | null;
	userId: string;
};
export async function update({
	taskId,
	title,
	description,
	status,
	priority,
	position,
	assigneeId,
	userId
}: UpdateInput) {
	const currentTask = await prisma.task.findUnique({
		where: {
			id: taskId
		},
		select: {
			assigneeId: true,
			project: {
				select: {
					organization: {
						select: {
							memberships: {
								where: {
									userId
								},
								select: {
									role: true
								}
							}
						}
					}
				}
			}
		}
	});

	if (!currentTask) {
		throw new NotFoundError('Task not found');
	}

	const [ membership ] = currentTask.project.organization.memberships;

	if (!membership) {
		throw new ForbiddenError('User is not a member of the organization')
	}

	const { role } = membership;
	const { assigneeId: currentAssigneeId } = currentTask;

	const isAdmin = role === MembershipRole.ADMIN;
	const isAssignee = currentAssigneeId === userId;

	const updatesAssigneeFields = (
		title !== undefined ||
		description !== undefined ||
		status !== undefined
	);

	const updatesAdminFields = (
		priority !== undefined ||
		assigneeId !== undefined
	);

	if (updatesAssigneeFields) {
		if (!isAdmin && !isAssignee) {
			throw new ForbiddenError(
				'Only admins or assignee can update a task\'s title, description or status'
			);
		}
	}

	if (updatesAdminFields) {
		if (!isAdmin) {
			throw new ForbiddenError(
				'Only admins can update a task\'s priority or assignee'
			);
		}
	}	
	
	const updatedTask = await prisma.task.update({
		where: {
			id: taskId,
		},
		data: {
			title,
			description,
			status,
			priority,
			position,
			assigneeId
		},
		omit: {
			creatorId: true
		}
	});

	return updatedTask;
}

export async function remove(taskId: string, userId: string) {
	const task = await prisma.task.findUnique({
		where: {
			id: taskId
		},
		select: {
			project: {
				select: {
					organizationId: true
				}
			}
		}
	});

	if (!task) {
		throw new NotFoundError('Task not found');
	}

	const { organizationId } = task.project;

	await requireMembership({
		organizationId,
		userId,
		minimumRole: MembershipRole.ADMIN
	});

	await prisma.task.delete({
		where: {
			id: taskId
		}
	});
}

export const taskService = {
	create,
	getByProject,
	getOne,
	update,
	delete: remove,
};