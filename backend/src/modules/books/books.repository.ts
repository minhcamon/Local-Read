import { eq, desc } from 'drizzle-orm';
import { db, type AppDatabase } from '../../database/client.js';
import { books, documents, type BookEntity, type NewBookEntity, type NewDocumentEntity } from '../../database/schema/index.js';

export class BooksRepository {
  constructor(private readonly client: AppDatabase = db) {}

  public async findAll() {
    return this.client.query.books.findMany({
      orderBy: [desc(books.updatedAt)],
      with: {
        documents: {
          with: {
            progress: true,
          },
        },
      },
    });
  }

  public async findById(id: string) {
    return this.client.query.books.findFirst({
      where: eq(books.id, id),
      with: {
        documents: {
          with: {
            progress: true,
            highlights: true,
          },
        },
      },
    });
  }

  public async createWithDocument(data: {
    book: NewBookEntity;
    document: NewDocumentEntity;
  }) {
    return this.client.transaction(async (tx: any) => {
      await tx.insert(books).values(data.book);
      await tx.insert(documents).values(data.document);
      return { book: data.book, document: data.document };
    });
  }

  public async update(id: string, updates: Partial<BookEntity>): Promise<BookEntity | null> {
    const updated = await this.client
      .update(books)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(books.id, id))
      .returning();

    return updated[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const res = await this.client.delete(books).where(eq(books.id, id));
    return res.rowsAffected > 0;
  }
}

export const booksRepository = new BooksRepository();
