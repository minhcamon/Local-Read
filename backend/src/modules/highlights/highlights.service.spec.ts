import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HighlightsService } from './highlights.service.js';
import { NotFoundError } from '../../common/errors/AppError.js';

describe('HighlightsService', () => {
  let mockDb: any;
  let service: HighlightsService;

  beforeEach(() => {
    mockDb = {
      query: {
        documents: {
          findFirst: vi.fn(),
        },
        highlights: {
          findMany: vi.fn(),
        },
      },
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          run: vi.fn(),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          run: vi.fn().mockReturnValue({ changes: 1 }),
        }),
      }),
    };

    service = new HighlightsService(mockDb);
  });

  it('should throw NotFoundError if creating highlight on non-existent document', async () => {
    mockDb.query.documents.findFirst.mockResolvedValue(null);

    await expect(
      service.createHighlight('invalid-doc', {
        location: { type: 'pdf_page', value: { pageNumber: 2 } },
        color: '#FACC15',
        textContent: 'Important quote',
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should create and return highlight with default soft yellow color', async () => {
    mockDb.query.documents.findFirst.mockResolvedValue({ id: 'doc-1' });

    const result = await service.createHighlight('doc-1', {
      location: { type: 'pdf_page', value: { pageNumber: 2 } },
      color: '#FACC15',
      textContent: 'Important quote',
    });

    expect(result.id).toBeDefined();
    expect(result.color).toBe('#FACC15');
    expect(result.textContent).toBe('Important quote');
    expect(mockDb.insert).toHaveBeenCalledTimes(1);
  });
});
