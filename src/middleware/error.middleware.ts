import { ErrorRequestHandler, NextFunction, Request } from 'express';
import { logger } from '../lib/logger';
import { ConflictError, NotFoundError } from '../errors/errors';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	logger.error(err);

	if (err instanceof ConflictError) {
		return res.status(409).json({
			message: err.message,
		});
	}

	if (err instanceof NotFoundError) {
		return res.status(404).json({
			message: err.message,
		});
	}

	res.status(500).json({
		message: 'Internal server error'
	});
};