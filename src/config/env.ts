import 'dotenv/config';

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const PORT = process.env.PORT || '3000';

export const DEV_USER_ID = NODE_ENV === 'development' ? 'test_user_id' : undefined;
export const DEV_USER_EMAIL = NODE_ENV === 'development' ? 'test@test.com' : undefined;