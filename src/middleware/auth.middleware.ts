// Temporary development auth middleware.
// Replace with real JWT verification later.
import { Request, Response, NextFunction } from 'express';
import {  JWT_SECRET } from '../config/env.js';
import { UnauthorizedError } from '../errors/errors.js';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types.js';

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
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Expired token');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw error;
  }
}