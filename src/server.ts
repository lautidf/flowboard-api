import { app } from './app.js';
import { PORT } from './config/env.js';
import { logger } from './lib/logger.js';

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});