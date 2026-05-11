import { ErrorRequestHandler, NextFunction, Request } from 'express';
import { logger } from '../lib/logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	logger.error(err);
	res.status(500).json({
		message: 'Internal server error'
	});
};