import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger.js';
import { AppError, ConflictError, NotFoundError } from '../errors/errors.js';
import { ZodError } from 'zod';

export function notExistentRouteHandler(req: Request, _res: Response) {
	throw new NotFoundError(`Route ${req.method} ${req.path} not found`);
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
		});
	}

	if (err instanceof ZodError) {
		return res.status(400).json({
			message: 'Validation failed',
			errors: err.issues.map(issue => ({
				path: issue.path.join('.'),
				message: issue.message,
			}))
		});
	}
	
	logger.error(err);
	res.status(500).json({
		message: 'Internal server error'
	});
};