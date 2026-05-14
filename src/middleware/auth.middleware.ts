// Temporary development auth middleware.
// Replace with real JWT verification later.
import { Request, Response, NextFunction } from 'express';
import { DEV_USER_EMAIL, DEV_USER_ID, NODE_ENV } from '../config/env';

export function authenticateJWT(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (NODE_ENV !== 'development') {
		throw new Error('Not implemented: authenticateJWT middleware should only be used in development');
	}

	req.user = {
    id: DEV_USER_ID as string,
		email: DEV_USER_EMAIL as string,
  };

  next();
}