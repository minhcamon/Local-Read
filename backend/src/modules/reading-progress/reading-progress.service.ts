import crypto from 'node:crypto';
import type { ReadingProgressEntity } from '../../database/schema/index.js';
import { db, DatabaseClient } from '../../database/client.js';
import { NotFoundError } from '../../common/errors/AppError.js';
import type { SaveProgressDto, ReadingProgressResponseDto } from './dto/index.js';

export class ReadingProgressService {
  constructor(private readonly client: DatabaseClient = db) {}

  public async getProgressByDocumentId(documentId: string): Promise<ReadingProgressResponseDto | null> {
    const progress = this.client.progress.get(documentId);
    if (!progress) return null;
    return progress;
  }

  public async saveProgress(documentId: string, dto: SaveProgressDto): Promise<ReadingProgressResponseDto> {
    const document = this.client.documents.get(documentId);
    if (!document) {
      throw new NotFoundError(`Document with ID "${documentId}" not found`);
    }

    const now = new Date().toISOString();
    const existing = this.client.progress.get(documentId);

    const totalPages = dto.location.value.totalPages || 1;
    const computedPercentage = dto.percentage !== undefined
      ? dto.percentage
      : Math.min(100, Math.round((dto.location.value.pageNumber / totalPages) * 100));

    const progressRecord: ReadingProgressEntity = {
      id: existing ? existing.id : crypto.randomUUID(),
      documentId,
      location: dto.location,
      percentage: computedPercentage,
      updatedAt: now,
    };

    this.client.progress.set(documentId, progressRecord);

    // Update book's updatedAt
    const book = this.client.books.get(document.bookId);
    if (book) {
      this.client.books.set(book.id, { ...book, updatedAt: now });
    }

    return progressRecord;
  }
}

export const readingProgressService = new ReadingProgressService();
