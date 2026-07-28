import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../types/auth.types.js';
import { JWT_SECRET } from '../../config/env.js';

export function generateAccessToken(userId: string, email: string) {
  const payload: JwtPayload = {
    sub: userId,
    email: email,
  };

  const token = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return token;
}

export function verifyAccessToken(token:string) {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
  return decoded;
}