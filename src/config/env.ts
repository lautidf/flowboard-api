import 'dotenv/config';

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const PORT = process.env.PORT || '3000';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const API_URL = process.env.API_URL || 'http://localhost:3000';