import type { BookEntity } from '../../database/schema/index.js';
import { db, DatabaseClient } from '../../database/client.js';

export class BooksRepository {
  constructor(private readonly client: DatabaseClient = db) {}

  public async findAll(): Promise<BookEntity[]> {
    return Array.from(this.client.books.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public async findById(id: string): Promise<BookEntity | null> {
    return this.client.books.get(id) || null;
  }

  public async create(book: BookEntity): Promise<BookEntity> {
    this.client.books.set(book.id, book);
    return book;
  }

  public async update(id: string, updates: Partial<BookEntity>): Promise<BookEntity | null> {
    const existing = this.client.books.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.client.books.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return this.client.books.delete(id);
  }
}

export const booksRepository = new BooksRepository();
