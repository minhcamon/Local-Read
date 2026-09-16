import crypto from 'node:crypto';
import { booksRepository, BooksRepository } from './books.repository.js';
import { documentStorage, LocalFileStorageService } from '../../storage/local-file-storage.service.js';
import { NotFoundError, BadRequestError } from '../../common/errors/AppError.js';
import type { BookSummaryDto, ImportBookDto, GetBooksQueryDto } from './dto/index.js';
import type { ReadingLocation, PdfReadingLocationValue } from '../../database/schema/index.js';

export class BooksService {
  constructor(
    private readonly repo: BooksRepository = booksRepository,
    private readonly storage: LocalFileStorageService = documentStorage
  ) {}

  public async getAllBooks(query?: GetBooksQueryDto): Promise<BookSummaryDto[]> {
    const bookList = await this.repo.findAll();

    const mapped: BookSummaryDto[] = bookList.map((book: any) => {
      const primaryDoc = book.documents?.[0];
      const progress = primaryDoc?.progress;

      let parsedLocation: ReadingLocation<PdfReadingLocationValue> | null = null;
      if (progress?.location) {
        parsedLocation = typeof progress.location === 'string'
          ? JSON.parse(progress.location)
          : (progress.location as ReadingLocation<PdfReadingLocationValue>);
      }

      const progressPercent = progress?.percentage ?? 0;
      const currentPage = parsedLocation?.value?.pageNumber ?? (progressPercent > 0 ? 1 : 0);
      const totalPages = parsedLocation?.value?.totalPages ?? (currentPage > 0 ? currentPage : 0);

      // Category derivation:
      // percentage === 0 -> 'saved' (Chưa đọc / Sách đã lưu)
      // percentage >= 100 -> 'finished' (Đã đọc xong)
      // 0 < percentage < 100 -> 'reading' (Đang đọc)
      let category: 'reading' | 'finished' | 'saved' = 'saved';
      if (progressPercent >= 100) {
        category = 'finished';
      } else if (progressPercent > 0 || currentPage > 0) {
        category = 'reading';
      }

      // Estimated read time: ~1.5 min per page remaining
      let estimatedReadTimeMinutes = 0;
      if (category !== 'finished' && totalPages > currentPage) {
        estimatedReadTimeMinutes = Math.max(1, Math.round((totalPages - currentPage) * 1.5));
      }

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        category,
        progressPercent,
        currentPage,
        totalPages,
        estimatedReadTimeMinutes,
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

    // Apply filtering
    return mapped.filter((b) => {
      if (query?.category && query.category !== 'all') {
        if (b.category !== query.category) return false;
      }
      if (query?.q && query.q.trim()) {
        const term = query.q.trim().toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(term);
        const matchesAuthor = (b.author || '').toLowerCase().includes(term);
        if (!matchesTitle && !matchesAuthor) return false;
      }
      return true;
    });
  }

  public async getBookById(id: string) {
    const book = await this.repo.findById(id);
    if (!book) {
      throw new NotFoundError(`Book with ID "${id}" not found`);
    }

    const docs = Array.isArray(book.documents) ? book.documents : [];
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverUrl: book.coverUrl,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      documents: docs.map((doc: any) => ({
        id: doc.id,
        bookId: doc.bookId,
        format: doc.format,
        fileSizeBytes: doc.fileSizeBytes,
        createdAt: doc.createdAt,
        progress: doc.progress || null,
        highlightsCount: doc.highlights?.length || 0,
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

  public async deleteBook(id: string): Promise<boolean> {
    const book = await this.repo.findById(id);
    if (!book) {
      throw new NotFoundError(`Book with ID "${id}" not found`);
    }

    // 1. Delete associated physical files in storage boundary
    const docs = (Array.isArray(book.documents) ? book.documents : []) as any[];
    for (const doc of docs) {
      if (doc.filePath) {
        try {
          await this.storage.deleteFile(doc.filePath);
        } catch {
          // Log and continue if file was already removed
        }
      }
    }

    // 2. Delete database records (cascades to documents, progress, highlights)
    return this.repo.delete(id);
  }
}

export const booksService = new BooksService();
