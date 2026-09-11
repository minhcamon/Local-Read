import type { Readable } from 'node:stream';
import type { DocumentEntity } from '../../database/schema/index.js';
import { db, DatabaseClient } from '../../database/client.js';
import { documentStorage, LocalFileStorageService } from '../../storage/local-file-storage.service.js';
import { NotFoundError } from '../../common/errors/AppError.js';

export class DocumentsService {
  constructor(
    private readonly storage: LocalFileStorageService = documentStorage,
    private readonly client: DatabaseClient = db
  ) {}

  public async getDocumentById(id: string): Promise<DocumentEntity> {
    const document = this.client.documents.get(id);
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
