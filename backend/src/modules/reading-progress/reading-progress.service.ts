import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db, type AppDatabase } from '../../database/client.js';
import { documents, readingProgress, books, type ReadingLocation } from '../../database/schema/index.js';
import { NotFoundError } from '../../common/errors/AppError.js';
import type { SaveProgressDto, ReadingProgressResponseDto } from './dto/index.js';

export class ReadingProgressService {
  constructor(private readonly client: AppDatabase = db) {}

  public async getProgressByDocumentId(documentId: string): Promise<ReadingProgressResponseDto | null> {
    const progress = await this.client.query.readingProgress.findFirst({
      where: eq(readingProgress.documentId, documentId),
    });

    if (!progress) return null;

    let parsedLocation: ReadingLocation;
    try {
      parsedLocation = typeof progress.location === 'string'
        ? JSON.parse(progress.location)
        : (progress.location as ReadingLocation);
    } catch {
      parsedLocation = { type: 'pdf_page', value: { pageNumber: 1 } };
    }

    return {
      id: progress.id,
      documentId: progress.documentId,
      location: parsedLocation,
      percentage: progress.percentage,
      updatedAt: progress.updatedAt,
    };
  }

  public async saveProgress(documentId: string, dto: SaveProgressDto): Promise<ReadingProgressResponseDto> {
    const document = await this.client.query.documents.findFirst({
      where: eq(documents.id, documentId),
    });

    if (!document) {
      throw new NotFoundError(`Document with ID "${documentId}" not found`);
    }

    const totalPages = dto.location.value?.totalPages || 1;
    const pageNumber = Math.max(1, dto.location.value?.pageNumber || 1);

    const computedPercentage = dto.percentage !== undefined
      ? Math.min(100, Math.max(0, Math.round(dto.percentage)))
      : Math.min(100, Math.max(0, Math.round((pageNumber / totalPages) * 100)));

    const now = new Date().toISOString();
    const progressId = crypto.randomUUID();

    // Atomic upsert with Drizzle onConflictDoUpdate
    await this.client
      .insert(readingProgress)
      .values({
        id: progressId,
        documentId,
        location: dto.location,
        percentage: computedPercentage,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: readingProgress.documentId,
        set: {
          location: dto.location,
          percentage: computedPercentage,
          updatedAt: now,
        },
      });

    // Update book updatedAt
    await this.client
      .update(books)
      .set({ updatedAt: now })
      .where(eq(books.id, document.bookId));

    return {
      id: progressId,
      documentId,
      location: dto.location,
      percentage: computedPercentage,
      updatedAt: now,
    };
  }
}

export const readingProgressService = new ReadingProgressService();
