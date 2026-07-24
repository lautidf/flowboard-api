import { beforeEach } from 'vitest';
import { clearDatabase } from './helpers/database';

beforeEach(async () => {
  await clearDatabase();
});