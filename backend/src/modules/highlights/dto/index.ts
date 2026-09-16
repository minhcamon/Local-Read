import { z } from 'zod';

export const CreateHighlightSchema = z.object({
  location: z.object({
    type: z.literal('pdf_page'),
    value: z.object({
      pageNumber: z.number().int().min(1),
      rects: z.array(z.any()).optional(),
    }),
  }),
  color: z.string().default('#FACC15'),
  textContent: z.string().min(1, 'Text content cannot be empty').max(5000),
  note: z.string().max(2000).optional().nullable(),
});

export type CreateHighlightDto = z.infer<typeof CreateHighlightSchema>;

export interface HighlightResponseDto {
  id: string;
  documentId: string;
  location: {
    type: string;
    value: unknown;
  };
  color: string;
  textContent: string;
  note?: string | null;
  createdAt: string;
}
