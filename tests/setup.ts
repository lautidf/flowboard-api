import { beforeEach } from 'vitest';
import { clearDatabase } from './helpers/database.js';

beforeEach(async () => {
  await clearDatabase();
});
