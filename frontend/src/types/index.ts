export type ReadingTheme = 'light' | 'ivory' | 'sepia' | 'dark';

export interface PdfLocationValue {
  pageNumber: number;
  totalPages?: number;
  rects?: { x: number; y: number; width: number; height: number }[];
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
  progress?: ReadingProgress | null;
  highlightsCount?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  coverUrl: string | null;
  category?: 'reading' | 'finished' | 'saved';
  progressPercent?: number;
  currentPage?: number;
  totalPages?: number;
  estimatedReadTimeMinutes?: number;
  primaryDocumentId?: string | null;
  createdAt: string;
  updatedAt: string;
  documentCount?: number;
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
  note?: string | null;
  createdAt: string;
}
