export interface ReadingLocation<T = unknown> {
  type: string; // MVP: 'pdf_page'
  value: T;     // MVP: { pageNumber: number, totalPages?: number }
}

export interface BookEntity {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentEntity {
  id: string;
  bookId: string;
  format: 'PDF';
  filePath: string;
  fileSizeBytes: number;
  checksum: string | null;
  createdAt: string;
}

export interface ReadingProgressEntity {
  id: string;
  documentId: string;
  location: ReadingLocation;
  percentage: number;
  updatedAt: string;
}

export interface HighlightEntity {
  id: string;
  documentId: string;
  location: ReadingLocation;
  color: string; // e.g. '#FACC15'
  textContent: string;
  createdAt: string;
}
