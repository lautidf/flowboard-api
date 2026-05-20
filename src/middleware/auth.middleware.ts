// Temporary development auth middleware.
// Replace with real JWT verification later.
import { Request, Response, NextFunction } from 'express';
import { DEV_USER_EMAIL, DEV_USER_ID, JWT_SECRET, NODE_ENV } from '../config/env';
import { UnauthorizedError } from '../errors/errors';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

export function authenticateJWT(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Token missing');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
			id: decoded.sub,
			email: decoded.email,
		};

    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}