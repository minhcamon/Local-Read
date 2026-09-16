import React, { useState, useEffect, useCallback } from 'react';
import type { ReadingTheme, Book } from '../../../types/index.js';
import { booksService } from '../../../services/books.service.js';
import { ReaderChrome } from '../components/ReaderChrome.js';
import { TypographyDrawer } from '../components/TypographyDrawer.js';
import { NotesDrawer } from '../components/NotesDrawer.js';
import { PdfViewer } from '../components/PdfViewer.js';
import { useReadingProgress } from '../../reading-progress/hooks/useReadingProgress.js';
import { useHighlights } from '../../highlights/hooks/useHighlights.js';

interface ReaderPageProps {
  bookId: string;
  onBack: () => void;
  currentTheme: ReadingTheme;
  onThemeChange: (theme: ReadingTheme) => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({
  bookId,
  onBack,
  currentTheme,
  onThemeChange,
}) => {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [bookError, setBookError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'single' | 'double'>('single');
  const [isTypoOpen, setIsTypoOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scale, setScale] = useState<number>(1.0);

  // Typography settings
  const [fontSize, setFontSize] = useState<number>(19);
  const [lineHeight, setLineHeight] = useState<'tight' | 'normal' | 'relaxed'>('normal');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');

  // 1. Fetch Book Details from Backend
  useEffect(() => {
    let isMounted = true;
    setIsLoadingBook(true);
    setBookError(null);

    booksService
      .getBookById(bookId)
      .then((data) => {
        if (isMounted) {
          setBook(data);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          console.error('Failed to load book:', err);
          setBookError(err.response?.data?.message || 'Không thể tải thông tin sách.');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingBook(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  // Extract primary document ID
  const primaryDocId = book?.documents?.[0]?.id || book?.primaryDocumentId || null;

  // 2. Reading Progress Hook (Debounced Auto-save & Resume)
  const {
    currentPage,
    totalPages,
    setTotalPages,
    updatePage,
    isLoadingProgress,
  } = useReadingProgress(primaryDocId);

  // 3. Highlights Hook
  const {
    highlights,
    addHighlight,
    removeHighlight,
  } = useHighlights(primaryDocId);

  // 4. Page Navigation handlers
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      updatePage(currentPage + 1);
    }
  }, [currentPage, totalPages, updatePage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      updatePage(currentPage - 1);
    }
  }, [currentPage, updatePage]);

  const handleJumpToPage = useCallback((pageNum: number) => {
    updatePage(pageNum);
  }, [updatePage]);

  // 5. Laptop Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'w' || e.key === 'W') {
        setScale(1.0); // Reset to Fit-Width default
      } else if (e.ctrlKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)));
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  if (isLoadingBook) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center font-sans space-y-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm">Đang mở sách...</p>
      </div>
    );
  }

  if (bookError || !book || !primaryDocId) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center font-sans space-y-4 px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="font-headline-sm text-lg text-on-surface">Không thể mở tài liệu</h2>
        <p className="text-on-surface-variant text-sm max-w-md">
          {bookError || 'Không tìm thấy tệp tài liệu PDF đính kèm cuốn sách này.'}
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded bg-primary text-on-primary text-sm hover:opacity-90 transition-opacity"
        >
          Quay lại Thư viện
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-serif transition-colors select-text">
      {/* Top Reading Navigation Bar */}
      <ReaderChrome
        book={book}
        onBack={onBack}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleToc={() => {}}
        onToggleTypo={() => setIsTypoOpen(!isTypoOpen)}
        onToggleTone={() => {
          const themes: ReadingTheme[] = ['light', 'ivory', 'sepia', 'dark'];
          const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
          onThemeChange(themes[nextIdx]);
        }}
        onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        isNotesOpen={isNotesOpen}
        currentPage={currentPage}
        totalPages={totalPages}
        scale={scale}
        onZoomIn={() => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)))}
        onZoomOut={() => setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)))}
        onFitWidth={() => setScale(1.0)}
      />

      {/* Typography Drawer */}
      <TypographyDrawer
        isOpen={isTypoOpen}
        onClose={() => setIsTypoOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        lineHeight={lineHeight}
        onLineHeightChange={setLineHeight}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
      />

      {/* Notes & Highlights Inspector Drawer */}
      <NotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        bookTitle={book.title}
        highlights={highlights}
        onDeleteHighlight={removeHighlight}
        onJumpToPage={handleJumpToPage}
      />

      {/* Primary Reading Workspace — Real PDF Canvas */}
      <main className="w-full flex-1 flex flex-col items-center justify-start py-6 px-2 sm:px-4">
        {isLoadingProgress && (
          <div className="text-xs text-on-surface-variant font-sans mb-2">
            Đang phục hồi tiến độ đọc...
          </div>
        )}

        <PdfViewer
          documentId={primaryDocId}
          currentPage={currentPage}
          scale={scale}
          onPageChange={(_page, total) => {
            if (total > 0 && total !== totalPages) {
              setTotalPages(total);
            }
          }}
          highlights={highlights}
          onAddHighlight={addHighlight}
          onDeleteHighlight={removeHighlight}
        />

        {/* Bottom Floating Navigation Bar */}
        <footer className="sticky bottom-4 z-30 mt-6 px-4 py-2 bg-surface-container/90 backdrop-blur-md rounded-full shadow-paper border border-outline-variant/40 flex items-center gap-4 font-sans text-xs text-on-surface select-none">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 cursor-pointer"
            title="Trang trước (←)"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            <span className="hidden sm:inline">Trang trước</span>
          </button>

          <span className="font-label-md text-secondary font-medium">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 cursor-pointer"
            title="Trang tiếp (→ hoặc Space)"
          >
            <span className="hidden sm:inline">Trang tiếp</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </footer>
      </main>
    </div>
  );
};
