import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './common/logger/index.js';

const app = createApp();

app.listen(config.port, () => {
  logger.info(`LocalRead Backend Server running on http://localhost:${config.port}`, 'Bootstrap');
  logger.info(`OpenAPI Documentation available at http://localhost:${config.port}/api/docs`, 'Bootstrap');
});
