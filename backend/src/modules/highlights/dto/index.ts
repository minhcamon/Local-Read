import { z } from 'zod';

export const CreateHighlightSchema = z.object({
  location: z.object({
    type: z.literal('pdf_page'),
    value: z.object({
      pageNumber: z.number().int().min(1),
    }),
  }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Color must be a valid 6-character hex').default('#FACC15'),
  textContent: z.string().min(1, 'Text content cannot be empty').max(5000),
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
  createdAt: string;
}
