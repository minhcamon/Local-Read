import crypto from 'node:crypto';
import type { BookEntity, DocumentEntity } from '../../database/schema/index.js';
import { booksRepository, BooksRepository } from './books.repository.js';
import { db, DatabaseClient } from '../../database/client.js';
import { documentStorage, LocalFileStorageService } from '../../storage/local-file-storage.service.js';
import { NotFoundError, BadRequestError } from '../../common/errors/AppError.js';
import type { BookSummaryDto, ImportBookDto } from './dto/index.js';

export class BooksService {
  constructor(
    private readonly repo: BooksRepository = booksRepository,
    private readonly storage: LocalFileStorageService = documentStorage,
    private readonly client: DatabaseClient = db
  ) {}

  public async getAllBooks(): Promise<BookSummaryDto[]> {
    const books = await this.repo.findAll();
    return books.map((book) => {
      // Find associated documents
      const docs = Array.from(this.client.documents.values()).filter((d) => d.bookId === book.id);
      const firstDoc = docs[0];
      const progress = firstDoc ? this.client.progress.get(firstDoc.id) : null;

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        documentCount: docs.length,
        lastProgress: progress
          ? {
              percentage: progress.percentage,
              updatedAt: progress.updatedAt,
              location: progress.location,
            }
          : null,
      };
    });
  }

  public async getBookById(id: string): Promise<BookEntity & { documents: DocumentEntity[] }> {
    const book = await this.repo.findById(id);
    if (!book) {
      throw new NotFoundError(`Book with ID "${id}" not found`);
    }

    const documents = Array.from(this.client.documents.values()).filter((d) => d.bookId === book.id);
    return { ...book, documents };
  }

  public async importBook(dto: ImportBookDto, fileBuffer: Buffer, originalFilename: string): Promise<BookEntity> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestError('A valid PDF file buffer is required for import');
    }

    // 1. Save file to Document Storage Boundary
    const storedFile = await this.storage.saveFile(originalFilename, fileBuffer);

    const now = new Date().toISOString();
    const bookId = crypto.randomUUID();
    const docId = crypto.randomUUID();

    // 2. Create Book entity (Single source of metadata)
    const book: BookEntity = {
      id: bookId,
      title: dto.title.trim(),
      author: dto.author?.trim() || null,
      description: dto.description?.trim() || null,
      coverUrl: null,
      createdAt: now,
      updatedAt: now,
    };

    // 3. Create Document entity (Specific PDF file bound to Book)
    const document: DocumentEntity = {
      id: docId,
      bookId,
      format: 'PDF',
      filePath: storedFile.relativePath,
      fileSizeBytes: storedFile.sizeBytes,
      checksum: null,
      createdAt: now,
    };

    await this.repo.create(book);
    this.client.documents.set(docId, document);

    return book;
  }
}

export const booksService = new BooksService();
