import type { Readable } from 'node:stream';
import { eq } from 'drizzle-orm';
import { db, type AppDatabase } from '../../database/client.js';
import { documents, type DocumentEntity } from '../../database/schema/index.js';
import { documentStorage, LocalFileStorageService } from '../../storage/local-file-storage.service.js';
import { NotFoundError } from '../../common/errors/AppError.js';

export class DocumentsService {
  constructor(
    private readonly storage: LocalFileStorageService = documentStorage,
    private readonly client: AppDatabase = db
  ) {}

  public async getDocumentById(id: string): Promise<DocumentEntity> {
    const document = await this.client.query.documents.findFirst({
      where: eq(documents.id, id),
    });

    if (!document) {
      throw new NotFoundError(`Document with ID "${id}" not found`);
    }

    return document;
  }

  public async getDocumentStream(id: string): Promise<{ stream: Readable; document: DocumentEntity }> {
    const document = await this.getDocumentById(id);
    const stream = await this.storage.getFileStream(document.filePath);
    return { stream, document };
  }
}

export const documentsService = new DocumentsService();
