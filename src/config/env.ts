import 'dotenv/config';

export const PORT = process.env.PORT || '3000';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const API_URL = process.env.API_URL || 'http://localhost:3000';