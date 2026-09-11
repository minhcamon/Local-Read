import type { BookEntity, DocumentEntity, ReadingProgressEntity, HighlightEntity } from './schema/index.js';

/**
 * In-memory persistence store for development & testing scaffolding.
 * Cleanly decoupled behind Repository classes per ARCHITECTURE.md §3 & §9.
 */
export class DatabaseClient {
  public books: Map<string, BookEntity> = new Map();
  public documents: Map<string, DocumentEntity> = new Map();
  public progress: Map<string, ReadingProgressEntity> = new Map(); // key: documentId
  public highlights: Map<string, HighlightEntity> = new Map();

  public clear(): void {
    this.books.clear();
    this.documents.clear();
    this.progress.clear();
    this.highlights.clear();
  }
}

export const db = new DatabaseClient();
