import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logger/index.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(err.message, 'ErrorHandler', { code: err.code, details: err.details });
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: err.code,
      message: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  logger.error(err.message, 'ErrorHandler', { stack: err.stack });
  res.status(500).json({
    statusCode: 500,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred',
    details: null,
    timestamp: new Date().toISOString(),
  });
}
