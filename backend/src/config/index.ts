import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  storage: {
    baseDir: path.resolve(process.env.STORAGE_DIR || path.join(process.cwd(), 'storage', 'documents')),
    maxFileSize: Number(process.env.MAX_FILE_SIZE_BYTES) || 100 * 1024 * 1024, // 100MB
  },
  database: {
    dbPath: process.env.DATABASE_URL || path.resolve(process.cwd(), 'data', 'localread.db'),
  }
};
