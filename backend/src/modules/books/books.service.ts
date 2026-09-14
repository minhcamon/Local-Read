import crypto from 'node:crypto';
import { booksRepository, BooksRepository } from './books.repository.js';
import { documentStorage, LocalFileStorageService } from '../../storage/local-file-storage.service.js';
import { NotFoundError, BadRequestError } from '../../common/errors/AppError.js';
import type { BookSummaryDto, ImportBookDto } from './dto/index.js';
import type { ReadingLocation } from '../../database/schema/index.js';

export class BooksService {
  constructor(
    private readonly repo: BooksRepository = booksRepository,
    private readonly storage: LocalFileStorageService = documentStorage
  ) {}

  public async getAllBooks(): Promise<BookSummaryDto[]> {
    const bookList = await this.repo.findAll();
    return bookList.map((book: any) => {
      const primaryDoc = book.documents?.[0];
      const progress = primaryDoc?.progress;

      let parsedLocation: ReadingLocation | null = null;
      if (progress?.location) {
        parsedLocation = typeof progress.location === 'string'
          ? JSON.parse(progress.location)
          : (progress.location as ReadingLocation);
      }

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        documentCount: book.documents?.length || 0,
        primaryDocumentId: primaryDoc?.id || null,
        lastProgress: progress && parsedLocation
          ? {
              percentage: progress.percentage,
              updatedAt: progress.updatedAt,
              location: parsedLocation,
            }
          : null,
      };
    });
  }

  public async getBookById(id: string) {
    const book = await this.repo.findById(id);
    if (!book) {
      throw new NotFoundError(`Book with ID "${id}" not found`);
    }

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverUrl: book.coverUrl,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      documents: (book.documents || []).map((doc: any) => ({
        id: doc.id,
        bookId: doc.bookId,
        format: doc.format,
        fileSizeBytes: doc.fileSizeBytes,
        createdAt: doc.createdAt,
      })),
    };
  }

  public async importBook(dto: ImportBookDto, fileBuffer: Buffer, originalFilename: string) {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestError('A valid PDF file buffer is required for import');
    }

    // 1. Save file to Document Storage Boundary
    const storedFile = await this.storage.saveFile(originalFilename, fileBuffer);

    const now = new Date().toISOString();
    const bookId = crypto.randomUUID();
    const docId = crypto.randomUUID();

    // 2. Title fallback to sanitized filename without extension
    const defaultTitle = originalFilename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
    const title = (dto.title && dto.title.trim()) ? dto.title.trim() : defaultTitle;

    // 3. Atomically create Book & Document via Drizzle transaction
    const { book, document } = await this.repo.createWithDocument({
      book: {
        id: bookId,
        title,
        author: dto.author?.trim() || null,
        description: dto.description?.trim() || null,
        coverUrl: null,
        createdAt: now,
        updatedAt: now,
      },
      document: {
        id: docId,
        bookId,
        format: 'PDF',
        filePath: storedFile.relativePath,
        fileSizeBytes: storedFile.sizeBytes,
        checksum: null,
        createdAt: now,
      },
    });

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverUrl: book.coverUrl,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      document: {
        id: document.id,
        format: document.format,
        fileSizeBytes: document.fileSizeBytes,
      },
    };
  }
}

export const booksService = new BooksService();
