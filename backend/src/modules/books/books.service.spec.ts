import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BooksService } from './books.service.js';
import { BadRequestError, NotFoundError } from '../../common/errors/AppError.js';
import type { BooksRepository } from './books.repository.js';
import type { LocalFileStorageService } from '../../storage/local-file-storage.service.js';

describe('BooksService', () => {
  let mockRepo: any;
  let mockStorage: any;
  let service: BooksService;

  beforeEach(() => {
    mockRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      createWithDocument: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockStorage = {
      saveFile: vi.fn(),
      getFileStream: vi.fn(),
      deleteFile: vi.fn(),
      fileExists: vi.fn(),
    };

    service = new BooksService(mockRepo as unknown as BooksRepository, mockStorage as unknown as LocalFileStorageService);
  });

  it('should throw BadRequestError when importing with empty file buffer', async () => {
    await expect(
      service.importBook({ title: 'Test Book' }, Buffer.alloc(0), 'test.pdf')
    ).rejects.toThrow(BadRequestError);
  });

  it('should import a book with document in a single transaction', async () => {
    const fileBuffer = Buffer.from('%PDF-1.4 sample content');
    mockStorage.saveFile.mockResolvedValue({
      fileName: '123_test.pdf',
      relativePath: '123_test.pdf',
      sizeBytes: fileBuffer.length,
      mimeType: 'application/pdf',
    });

    mockRepo.createWithDocument.mockResolvedValue({
      book: {
        id: 'book-1',
        title: 'My Architecture Book',
        author: 'Author Name',
        description: null,
        coverUrl: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      document: {
        id: 'doc-1',
        format: 'PDF',
        filePath: '123_test.pdf',
        fileSizeBytes: fileBuffer.length,
      },
    });

    const result = await service.importBook(
      { title: 'My Architecture Book', author: 'Author Name' },
      fileBuffer,
      'test.pdf'
    );

    expect(result.id).toBe('book-1');
    expect(result.title).toBe('My Architecture Book');
    expect(result.document.id).toBe('doc-1');
    expect(mockRepo.createWithDocument).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundError if requested book does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getBookById('non-existent')).rejects.toThrow(NotFoundError);
  });
});
