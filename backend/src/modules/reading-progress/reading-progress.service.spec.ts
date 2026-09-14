import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReadingProgressService } from './reading-progress.service.js';
import { NotFoundError } from '../../common/errors/AppError.js';

describe('ReadingProgressService', () => {
  let mockDb: any;
  let service: ReadingProgressService;

  beforeEach(() => {
    mockDb = {
      query: {
        documents: {
          findFirst: vi.fn(),
        },
        readingProgress: {
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockReturnValue({
            run: vi.fn(),
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            run: vi.fn(),
          }),
        }),
      }),
    };

    service = new ReadingProgressService(mockDb);
  });

  it('should throw NotFoundError if saving progress for non-existent document', async () => {
    mockDb.query.documents.findFirst.mockResolvedValue(null);

    await expect(
      service.saveProgress('invalid-doc-id', {
        location: { type: 'pdf_page', value: { pageNumber: 5, totalPages: 10 } },
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should calculate percentage and upsert progress with polymorphic location', async () => {
    mockDb.query.documents.findFirst.mockResolvedValue({
      id: 'doc-1',
      bookId: 'book-1',
    });

    const result = await service.saveProgress('doc-1', {
      location: { type: 'pdf_page', value: { pageNumber: 5, totalPages: 10 } },
    });

    expect(result.percentage).toBe(50);
    expect(result.location.type).toBe('pdf_page');
    expect((result.location.value as any).pageNumber).toBe(5);
    expect(mockDb.insert).toHaveBeenCalledTimes(1);
    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });
});
