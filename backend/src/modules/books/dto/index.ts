import { z } from 'zod';

export const ImportBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  author: z.string().max(255).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
});

export type ImportBookDto = z.infer<typeof ImportBookSchema>;

export interface BookSummaryDto {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  lastProgress?: {
    percentage: number;
    updatedAt: string;
    location: unknown;
  } | null;
}
