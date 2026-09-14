import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import fs from 'node:fs';
import path from 'node:path';
import * as schema from './schema/index.js';

const storageDir = path.resolve(process.cwd(), 'storage');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const dbPath = path.join(storageDir, 'localread.db');
const dbUrl = process.env.DATABASE_URL || `file:${dbPath.replace(/\\/g, '/')}`;

export const client = createClient({
  url: dbUrl,
});

export async function initDatabase(): Promise<void> {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      description TEXT,
      cover_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      format TEXT NOT NULL DEFAULT 'PDF',
      file_path TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL,
      checksum TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reading_progress (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL UNIQUE REFERENCES documents(id) ON DELETE CASCADE,
      location TEXT NOT NULL,
      percentage INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS highlights (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      location TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#FACC15',
      text_content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

initDatabase().catch((err) => console.error('Database initialization error:', err));

export const db = drizzle(client, { schema });
export type AppDatabase = typeof db;
