import crypto from 'node:crypto';
import type { HighlightEntity } from '../../database/schema/index.js';
import { db, DatabaseClient } from '../../database/client.js';
import { NotFoundError } from '../../common/errors/AppError.js';
import type { CreateHighlightDto, HighlightResponseDto } from './dto/index.js';

export class HighlightsService {
  constructor(private readonly client: DatabaseClient = db) {}

  public async getHighlightsByDocument(documentId: string): Promise<HighlightResponseDto[]> {
    const highlights = Array.from(this.client.highlights.values()).filter(
      (h) => h.documentId === documentId
    );
    return highlights.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public async createHighlight(documentId: string, dto: CreateHighlightDto): Promise<HighlightResponseDto> {
    const document = this.client.documents.get(documentId);
    if (!document) {
      throw new NotFoundError(`Document with ID "${documentId}" not found`);
    }

    const highlight: HighlightEntity = {
      id: crypto.randomUUID(),
      documentId,
      location: dto.location,
      color: dto.color,
      textContent: dto.textContent,
      createdAt: new Date().toISOString(),
    };

    this.client.highlights.set(highlight.id, highlight);
    return highlight;
  }
}

export const highlightsService = new HighlightsService();
