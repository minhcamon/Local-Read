import { z } from 'zod';

export const SaveProgressSchema = z.object({
  location: z.object({
    type: z.literal('pdf_page'),
    value: z.object({
      pageNumber: z.number().int().min(1),
      totalPages: z.number().int().min(1).optional(),
    }),
  }),
  percentage: z.number().min(0).max(100).optional(),
});

export type SaveProgressDto = z.infer<typeof SaveProgressSchema>;

export interface ReadingProgressResponseDto {
  id: string;
  documentId: string;
  location: {
    type: string;
    value: unknown;
  };
  percentage: number;
  updatedAt: string;
}
