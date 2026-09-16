import React, { useState, useEffect, useCallback } from 'react';
import type { Book } from '../../../types/index.js';
import { booksService } from '../../../services/books.service.js';
import { BookCard } from '../components/BookCard.js';
import { ImportModal } from '../components/ImportModal.js';

interface LibraryPageProps {
  onSelectBook: (bookId: string) => void;
  isImportModalOpen: boolean;
  onCloseImportModal: () => void;
  searchQuery?: string;
}

type FilterCategory = 'all' | 'reading' | 'finished';

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onSelectBook,
  isImportModalOpen,
  onCloseImportModal,
  searchQuery = '',
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await booksService.getBooks({
        category: activeFilter,
        q: searchQuery,
      });
      setBooks(data);
    } catch (err: any) {
      console.error('Error fetching books:', err);
      setErrorMessage('Không thể tải danh sách sách từ máy chủ.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const readingCount = books.filter(
    (b) => b.category === 'reading' || ((b.progressPercent || 0) > 0 && (b.progressPercent || 0) < 100)
  ).length;

  const handleDeleteBook = async (bookId: string) => {
    try {
      await booksService.deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err: any) {
      console.error('Failed to delete book:', err);
      alert(err.response?.data?.message || 'Không thể xóa sách.');
    }
  };

  const handleImportSuccess = (newBook: Book) => {
    fetchBooks();
    if (newBook?.id) {
      onSelectBook(newBook.id);
    }
  };

  return (
    <>
      {/* Header section: Calm, Literary & Uncluttered */}
      <header className="pb-6 border-b border-outline-variant/30 space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-normal">
          Thư viện của bạn
        </h1>
        <p className="font-serif italic text-xs sm:text-sm text-on-surface-variant/85 font-normal">
          {isLoading
            ? 'Đang nạp...'
            : readingCount > 0
            ? `${readingCount} cuốn đang đọc`
            : 'Chưa có sách đang đọc dở'}
        </p>
      </header>

      {/* 3-Tab Filter Navigation */}
      <nav
        aria-label="Bộ lọc thư viện"
        className="flex items-center gap-8 pt-6 pb-10 font-mono text-xs tracking-wider"
      >
        <button
          onClick={() => setActiveFilter('all')}
          className={`pb-1 transition-all ${
            activeFilter === 'all'
              ? 'text-primary border-b border-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface border-b border-transparent'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveFilter('reading')}
          className={`pb-1 transition-all ${
            activeFilter === 'reading'
              ? 'text-primary border-b border-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface border-b border-transparent'
          }`}
        >
          Đang đọc
        </button>
        <button
          onClick={() => setActiveFilter('finished')}
          className={`pb-1 transition-all ${
            activeFilter === 'finished'
              ? 'text-primary border-b border-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface border-b border-transparent'
          }`}
        >
          Đã xong
        </button>
      </nav>

      {errorMessage && (
        <div className="mb-8 p-3 bg-error-container text-error rounded-xs text-xs font-mono">
          {errorMessage}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-2.5">
              <div className="aspect-2/3 bg-surface-container-high rounded-xs" />
              <div className="h-0.5 bg-surface-container-high rounded-xs w-full" />
            </div>
          ))}
        </div>
      ) : (
        /* Bookshelf Grid */
        <section
          aria-label="Danh sách sách"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10"
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onDelete={handleDeleteBook}
            />
          ))}
        </section>
      )}

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className="py-24 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
            <span className="material-symbols-outlined text-[26px]">auto_stories</span>
          </div>
          <p className="font-serif text-lg text-primary font-normal">
            {searchQuery ? 'Không tìm thấy sách phù hợp' : 'Không gian đọc đang tĩnh lặng'}
          </p>
          <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? 'Hãy thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc.'
              : 'Kéo thả tệp PDF vào bất kỳ vị trí nào trên màn hình hoặc chọn "+ Thêm sách" trên thanh điều hướng.'}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={onCloseImportModal}
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
};
