import crypto from 'node:crypto';
import { eq, asc } from 'drizzle-orm';
import { db, type AppDatabase } from '../../database/client.js';
import { documents, highlights, type ReadingLocation } from '../../database/schema/index.js';
import { NotFoundError } from '../../common/errors/AppError.js';
import type { CreateHighlightDto, HighlightResponseDto } from './dto/index.js';

export class HighlightsService {
  constructor(private readonly client: AppDatabase = db) {}

  public async getHighlightsByDocument(documentId: string): Promise<HighlightResponseDto[]> {
    const list = await this.client.query.highlights.findMany({
      where: eq(highlights.documentId, documentId),
      orderBy: [asc(highlights.createdAt)],
    });

    return list.map((h: any) => {
      let parsedLocation: ReadingLocation;
      try {
        parsedLocation = typeof h.location === 'string'
          ? JSON.parse(h.location)
          : (h.location as ReadingLocation);
      } catch {
        parsedLocation = { type: 'pdf_page', value: { pageNumber: 1 } };
      }

      return {
        id: h.id,
        documentId: h.documentId,
        location: parsedLocation,
        color: h.color,
        textContent: h.textContent,
        createdAt: h.createdAt,
      };
    });
  }

  public async createHighlight(documentId: string, dto: CreateHighlightDto): Promise<HighlightResponseDto> {
    const document = await this.client.query.documents.findFirst({
      where: eq(documents.id, documentId),
    });

    if (!document) {
      throw new NotFoundError(`Document with ID "${documentId}" not found`);
    }

    const highlightId = crypto.randomUUID();
    const now = new Date().toISOString();

    await this.client
      .insert(highlights)
      .values({
        id: highlightId,
        documentId,
        location: dto.location,
        color: dto.color || '#FACC15',
        textContent: dto.textContent,
        createdAt: now,
      });

    return {
      id: highlightId,
      documentId,
      location: dto.location,
      color: dto.color || '#FACC15',
      textContent: dto.textContent,
      createdAt: now,
    };
  }

  public async deleteHighlight(highlightId: string): Promise<boolean> {
    const res = await this.client.delete(highlights).where(eq(highlights.id, highlightId));
    return res.rowsAffected > 0;
  }
}

export const highlightsService = new HighlightsService();
