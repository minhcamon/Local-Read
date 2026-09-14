import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Polymorphic Reading Location interface (ARCHITECTURE.md §4)
export interface PdfReadingLocationValue {
  pageNumber: number;
  totalPages?: number;
  rects?: { x: number; y: number; width: number; height: number }[];
}

export interface ReadingLocation<T = PdfReadingLocationValue> {
  type: string; // MVP: 'pdf_page'
  value: T;
}

// 1. Books Table (Single source of work metadata)
export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  description: text('description'),
  coverUrl: text('cover_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 2. Documents Table (Specific file tied to a format belonging to a Book)
export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  bookId: text('book_id')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  format: text('format').notNull().default('PDF'),
  filePath: text('file_path').notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  checksum: text('checksum'),
  createdAt: text('created_at').notNull(),
});

// 3. Reading Progress Table (Polymorphic location persisted as JSON)
export const readingProgress = sqliteTable('reading_progress', {
  id: text('id').primaryKey(),
  documentId: text('document_id')
    .notNull()
    .unique()
    .references(() => documents.id, { onDelete: 'cascade' }),
  location: text('location', { mode: 'json' }).$type<ReadingLocation>().notNull(),
  percentage: integer('percentage').notNull().default(0),
  updatedAt: text('updated_at').notNull(),
});

// 4. Highlights Table (Simple single-color highlights with JSON coordinates)
export const highlights = sqliteTable('highlights', {
  id: text('id').primaryKey(),
  documentId: text('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  location: text('location', { mode: 'json' }).$type<ReadingLocation>().notNull(),
  color: text('color').notNull().default('#FACC15'),
  textContent: text('text_content').notNull(),
  createdAt: text('created_at').notNull(),
});

// Drizzle Relations
export const booksRelations = relations(books, (helpers: any) => ({
  documents: helpers.many(documents),
}));

export const documentsRelations = relations(documents, (helpers: any) => ({
  book: helpers.one(books, {
    fields: [documents.bookId],
    references: [books.id],
  }),
  progress: helpers.one(readingProgress),
  highlights: helpers.many(highlights),
}));

export const readingProgressRelations = relations(readingProgress, (helpers: any) => ({
  document: helpers.one(documents, {
    fields: [readingProgress.documentId],
    references: [documents.id],
  }),
}));

export const highlightsRelations = relations(highlights, (helpers: any) => ({
  document: helpers.one(documents, {
    fields: [highlights.documentId],
    references: [documents.id],
  }),
}));

// TypeScript Model Types (Inferred directly from Drizzle Code-First Schema)
export type BookEntity = typeof books.$inferSelect;
export type NewBookEntity = typeof books.$inferInsert;

export type DocumentEntity = typeof documents.$inferSelect;
export type NewDocumentEntity = typeof documents.$inferInsert;

export type ReadingProgressEntity = typeof readingProgress.$inferSelect;
export type NewReadingProgressEntity = typeof readingProgress.$inferInsert;

export type HighlightEntity = typeof highlights.$inferSelect;
export type NewHighlightEntity = typeof highlights.$inferInsert;
