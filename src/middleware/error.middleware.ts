import { ErrorRequestHandler, NextFunction, Request } from 'express';
import { logger } from '../lib/logger';
import { AppError, ConflictError, NotFoundError } from '../errors/errors';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
		});
	}
	
	logger.error(err);
	res.status(500).json({
		message: 'Internal server error'
	});
};