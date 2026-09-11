import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReaderToolbar } from '../components/ReaderToolbar.js';
import { PdfViewer } from '../components/PdfViewer.js';
import { useReadingProgress } from '../../reading-progress/hooks/useReadingProgress.js';
import { booksService } from '../../../services/books.service.js';
import type { Book, DocumentSummary } from '../../../types/index.js';

interface ReaderPageProps {
  bookId: string;
  onBack: () => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({ bookId, onBack }) => {
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
  const { currentPage, totalPages, updatePage } = useReadingProgress(activeDoc?.id || null);

  // 3. Auto-hide Toolbar timer
  const resetHideTimer = useCallback(() => {
    setIsToolbarVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsToolbarVisible(false);
    }, 2500); // 2.5s mouse inactivity
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

  // 4. Keyboard Navigation Shortcuts
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
          setScale(1.0); // Fit-Width reset
          break;
        case '+':
        case '=':
          if (e.ctrlKey) {
            e.preventDefault();
            setScale((s) => Math.min(2.5, s + 0.1));
          }
          break;
        case '-':
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
    return <div style={styles.center}>Loading reader...</div>;
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
      />

      <PdfViewer
        documentId={activeDoc.id}
        currentPage={currentPage}
        scale={scale}
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
    gap: '12px',
    color: 'var(--text-secondary)',
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--accent-color)',
    color: '#FFF',
    borderRadius: '6px',
  },
};
