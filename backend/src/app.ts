import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { logger } from './common/logger/index.js';
import { errorHandler } from './common/middlewares/errorHandler.js';
import { booksController } from './modules/books/books.controller.js';
import { documentsController } from './modules/documents/documents.controller.js';
import { readingProgressController } from './modules/reading-progress/reading-progress.controller.js';
import { highlightsController } from './modules/highlights/highlights.controller.js';
import { swaggerDocument } from './swagger/swagger.config.js';

export function createApp(): Express {
  const app = express();

  // Basic Middlewares
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request Logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.url}`, 'HTTP');
    next();
  });

  // Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      version: 'v1-mvp',
      timestamp: new Date().toISOString(),
    });
  });

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Domain API Routes
  app.use('/api/books', booksController.router);
  app.use('/api/documents', documentsController.router);
  app.use('/api/progress', readingProgressController.router);
  app.use('/api/highlights', highlightsController.router);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
