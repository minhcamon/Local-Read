export interface DocumentResponseDto {
  id: string;
  bookId: string;
  format: 'PDF';
  fileSizeBytes: number;
  createdAt: string;
}
