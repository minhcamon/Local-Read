import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReaderToolbar } from '../components/ReaderToolbar.js';
import { PdfViewer } from '../components/PdfViewer.js';
import { useReadingProgress } from '../../reading-progress/hooks/useReadingProgress.js';
import { useHighlights } from '../../highlights/hooks/useHighlights.js';
import { booksService } from '../../../services/books.service.js';
import type { Book, DocumentSummary, ReadingTheme } from '../../../types/index.js';

interface ReaderPageProps {
  bookId: string;
  onBack: () => void;
  currentTheme?: ReadingTheme;
  onThemeChange?: (theme: ReadingTheme) => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({
  bookId,
  onBack,
  currentTheme = 'light',
  onThemeChange,
}) => {
  const [book, setBook] = useState<Book | null>(null);
  const [activeDoc, setActiveDoc] = useState<DocumentSummary | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);
  const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch book & document
  useEffect(() => {
    let isMounted = true;
    setIsLoadingBook(true);

    booksService
      .getBookById(bookId)
      .then((b) => {
        if (isMounted) {
          setBook(b);
          const doc = b.documents?.[0] || null;
          setActiveDoc(doc);
        }
      })
      .catch((err) => console.error('Failed to load book for reader:', err))
      .finally(() => {
        if (isMounted) setIsLoadingBook(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  // 2. Reading Progress Hook
  const { currentPage, totalPages, setTotalPages, updatePage } = useReadingProgress(activeDoc?.id || null);

  // 3. Highlights Hook
  const { highlights, addHighlight, removeHighlight } = useHighlights(activeDoc?.id || null);

  // 4. Auto-hide Toolbar timer (2.5s)
  const resetHideTimer = useCallback(() => {
    setIsToolbarVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsToolbarVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => resetHideTimer();
    window.addEventListener('mousemove', handleMouseMove);
    resetHideTimer();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // 5. Laptop Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      resetHideTimer();

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          updatePage(currentPage + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          updatePage(currentPage - 1);
          break;
        case 'w':
        case 'W':
          e.preventDefault();
          setScale(1.0); // Fit-Width
          break;
        case '+':
        case '=':
          if (e.ctrlKey) {
            e.preventDefault();
            setScale((s) => Math.min(2.5, s + 0.1));
          }
          break;
        case '-':
        case '_':
          if (e.ctrlKey) {
            e.preventDefault();
            setScale((s) => Math.max(0.5, s - 0.1));
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, updatePage, resetHideTimer]);

  if (isLoadingBook) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p>Opening document...</p>
      </div>
    );
  }

  if (!book || !activeDoc) {
    return (
      <div style={styles.center}>
        <p>Document not available.</p>
        <button style={styles.backBtn} onClick={onBack}>
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div style={styles.readerWrapper}>
      <ReaderToolbar
        bookTitle={book.title}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => updatePage(page)}
        scale={scale}
        onZoomIn={() => setScale((s) => Math.min(2.5, s + 0.1))}
        onZoomOut={() => setScale((s) => Math.max(0.5, s - 0.1))}
        onFitWidth={() => setScale(1.0)}
        onBack={onBack}
        isVisible={isToolbarVisible}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />

      <PdfViewer
        documentId={activeDoc.id}
        currentPage={currentPage}
        scale={scale}
        onPageChange={(_page, total) => {
          setTotalPages(total);
        }}
        highlights={highlights}
        onAddHighlight={(loc, text) => addHighlight(loc, text)}
        onDeleteHighlight={(id) => removeHighlight(id)}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  readerWrapper: {
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: 'var(--bg-app)',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    color: 'var(--text-secondary)',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid var(--border-color)',
    borderTopColor: 'var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--accent-color)',
    color: '#FFF',
    borderRadius: '6px',
    fontWeight: 500,
  },
};
