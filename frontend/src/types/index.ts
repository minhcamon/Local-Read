export type ReadingTheme = 'light' | 'sepia' | 'dark';

export interface PdfLocationValue {
  pageNumber: number;
  totalPages?: number;
}

export interface ReadingLocation<T = PdfLocationValue> {
  type: string; // MVP: 'pdf_page'
  value: T;
}

export interface ReadingProgress {
  id: string;
  documentId: string;
  location: ReadingLocation;
  percentage: number;
  updatedAt: string;
}

export interface DocumentSummary {
  id: string;
  bookId: string;
  format: 'PDF';
  fileSizeBytes: number;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  documents?: DocumentSummary[];
  lastProgress?: {
    percentage: number;
    updatedAt: string;
    location: ReadingLocation;
  } | null;
}

export interface Highlight {
  id: string;
  documentId: string;
  location: ReadingLocation;
  color: string;
  textContent: string;
  createdAt: string;
}
