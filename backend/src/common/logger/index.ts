export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
  data?: unknown;
}

export const logger = {
  log: (level: LogLevel, message: string, context?: string, data?: unknown) => {
    const payload: LogPayload = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      ...(data !== undefined ? { data } : {}),
    };
    const formatted = JSON.stringify(payload);
    if (level === 'error') {
      console.error(formatted);
    } else if (level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  },
  info: (message: string, context?: string, data?: unknown) => logger.log('info', message, context, data),
  warn: (message: string, context?: string, data?: unknown) => logger.log('warn', message, context, data),
  error: (message: string, context?: string, data?: unknown) => logger.log('error', message, context, data),
  debug: (message: string, context?: string, data?: unknown) => logger.log('debug', message, context, data),
};
