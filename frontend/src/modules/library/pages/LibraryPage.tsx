import React, { useState, useEffect, useCallback } from 'react';
import type { Book } from '../../../types/index.js';
import { booksService } from '../../../services/books.service.js';
import { BookCard } from '../components/BookCard.js';
import { DropZoneCard } from '../components/DropZoneCard.js';
import { ImportModal } from '../components/ImportModal.js';
import { Button } from '../../../components/ui/button.js';

interface LibraryPageProps {
  onSelectBook: (bookId: string) => void;
  isImportModalOpen: boolean;
  onCloseImportModal: () => void;
  searchQuery?: string;
}

type FilterCategory = 'all' | 'reading' | 'finished' | 'saved';

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onSelectBook,
  isImportModalOpen,
  onCloseImportModal,
  searchQuery = '',
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [internalImportOpen, setInternalImportOpen] = useState(false);
  const [isDropUploading, setIsDropUploading] = useState(false);
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

  const readingCount = books.filter((b) => b.category === 'reading' || ((b.progressPercent || 0) > 0 && (b.progressPercent || 0) < 100)).length;
  const totalCount = books.length;

  const handleFileDrop = async (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Vui lòng chọn tệp định dạng PDF hợp lệ.');
      return;
    }

    setIsDropUploading(true);
    try {
      const newBook = await booksService.importBook(file);
      await fetchBooks();
      // 1-click transition to read new book immediately
      if (newBook?.id) {
        onSelectBook(newBook.id);
      }
    } catch (err: any) {
      console.error('Failed to import dropped file:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi nạp sách PDF.');
    } finally {
      setIsDropUploading(false);
    }
  };

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
    <main className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full max-w-5xl mx-auto px-6 py-12">
        {/* Header section: Literary & Unhurried */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant/30">
          <div className="space-y-1.5">
            <h1 className="font-display-lg text-display-lg text-primary tracking-tight font-normal">
              Thư viện của bạn
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant font-normal tracking-wide">
              {isLoading ? 'Đang cập nhật tủ sách...' : `${totalCount} cuốn sách • ${readingCount} cuốn đang đọc dở`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="dashed"
              size="default"
              onClick={() => setInternalImportOpen(true)}
              id="btn-upload-trigger"
              className="inline-flex items-center gap-2 px-4 py-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Thêm sách</span>
            </Button>
          </div>
        </header>

        {/* Filter Navigation */}
        <nav
          aria-label="Bộ lọc thư viện"
          className="flex items-center gap-8 pt-7 pb-10 font-label-md text-label-md"
        >
          <button
            onClick={() => setActiveFilter('all')}
            className={`filter-tab pb-1 font-medium tracking-wide transition-all ${
              activeFilter === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter('reading')}
            className={`filter-tab pb-1 font-medium tracking-wide transition-all ${
              activeFilter === 'reading'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
            }`}
          >
            Đang đọc
          </button>
          <button
            onClick={() => setActiveFilter('finished')}
            className={`filter-tab pb-1 font-medium tracking-wide transition-all ${
              activeFilter === 'finished'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
            }`}
          >
            Đã đọc xong
          </button>
          <button
            onClick={() => setActiveFilter('saved')}
            className={`filter-tab pb-1 font-medium tracking-wide transition-all ${
              activeFilter === 'saved'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
            }`}
          >
            Sách đã lưu
          </button>
        </nav>

        {errorMessage && (
          <div className="mb-8 p-4 bg-error-container text-error rounded text-sm">
            {errorMessage}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-7 gap-y-11 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <div className="aspect-[2/3] bg-surface-container-high rounded-[2px]" />
                <div className="h-4 bg-surface-container-high rounded w-3/4" />
                <div className="h-3 bg-surface-container rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          /* Bookshelf Grid */
          <section
            aria-label="Danh sách sách"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-7 gap-y-11"
          >
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
                onDelete={handleDeleteBook}
              />
            ))}

            {/* Dropzone Slot */}
            <DropZoneCard
              onFileSelect={handleFileDrop}
              isUploading={isDropUploading}
            />
          </section>
        )}

        {!isLoading && books.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-4">
              <span className="material-symbols-outlined text-[32px]">auto_stories</span>
            </div>
            <p className="font-headline-sm text-secondary">
              {searchQuery ? 'Không tìm thấy sách phù hợp' : 'Tủ sách cá nhân của bạn đang trống'}
            </p>
            <p className="font-body-sm text-on-surface-variant max-w-md mx-auto">
              {searchQuery
                ? 'Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.'
                : 'Kéo thả file PDF vào ô thêm sách hoặc bấm "+ Thêm sách" để bắt đầu trải nghiệm đọc tĩnh lặng.'}
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <ImportModal
        isOpen={isImportModalOpen || internalImportOpen}
        onClose={() => {
          onCloseImportModal();
          setInternalImportOpen(false);
        }}
        onImportSuccess={handleImportSuccess}
      />

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/30 py-8 bg-surface-container-low mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-md text-label-md text-on-surface-variant">
          <span>LocalRead — Không gian tĩnh lặng cùng trang sách</span>
          <span>Tập trung • Thuần khiết • Lưu trữ cá nhân</span>
        </div>
      </footer>
    </main>
  );
};
