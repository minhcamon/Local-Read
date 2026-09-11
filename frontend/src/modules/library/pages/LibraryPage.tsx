import React, { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard.js';
import { ImportModal } from '../components/ImportModal.js';
import { booksService } from '../../../services/books.service.js';
import type { Book } from '../../../types/index.js';

interface LibraryPageProps {
  onSelectBook: (bookId: string) => void;
  isImportModalOpen: boolean;
  onCloseImportModal: () => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onSelectBook,
  isImportModalOpen,
  onCloseImportModal,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await booksService.getBooks();
      setBooks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleImport = async (file: File, title: string, author: string) => {
    await booksService.importBook(file, title, author);
    await fetchBooks();
  };

  return (
    <main style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.sectionTitle}>Your Bookshelf</h2>
          <p style={styles.subtitle}>
            {books.length} {books.length === 1 ? 'book' : 'books'} in your personal library
          </p>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.centerMessage}>Loading your library...</div>
      ) : error ? (
        <div style={styles.centerMessage}>
          <p style={{ color: '#EF4444' }}>{error}</p>
          <button style={styles.retryBtn} onClick={fetchBooks}>
            Retry
          </button>
        </div>
      ) : books.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📖</div>
          <h3>Your library is empty</h3>
          <p style={styles.emptyText}>
            Drag and drop a PDF file or click "Add Book" above to begin your reading session.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} onOpen={onSelectBook} />
          ))}
        </div>
      )}

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={onCloseImportModal}
        onImport={handleImport}
      />
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '24px',
  },
  centerMessage: {
    textAlign: 'center',
    padding: '60px 0',
    color: 'var(--text-secondary)',
  },
  retryBtn: {
    marginTop: '12px',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: 'var(--accent-color)',
    color: '#FFF',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '12px',
    border: '1px dashed var(--border-color)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    maxWidth: '400px',
    margin: '8px auto 0',
  },
};
