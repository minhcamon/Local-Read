import { z } from 'zod';

export const ImportBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  author: z.string().max(255).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
});

export type ImportBookDto = z.infer<typeof ImportBookSchema>;

export const GetBooksQuerySchema = z.object({
  category: z.enum(['all', 'reading', 'finished', 'saved']).optional().default('all'),
  q: z.string().optional(),
});

export type GetBooksQueryDto = z.infer<typeof GetBooksQuerySchema>;

export interface BookSummaryDto {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  coverUrl: string | null;
  category: 'reading' | 'finished' | 'saved';
  progressPercent: number;
  currentPage: number;
  totalPages: number;
  estimatedReadTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  primaryDocumentId: string | null;
  lastProgress?: {
    percentage: number;
    updatedAt: string;
    location: unknown;
  } | null;
}
