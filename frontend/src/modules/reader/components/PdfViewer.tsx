import React, { useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore - handled after user installs pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist';
import { documentsService } from '../../../services/documents.service.js';
import { HighlightOverlay } from '../../highlights/components/HighlightOverlay.js';
import { TextSelectionMenu } from '../../highlights/components/TextSelectionMenu.js';
import type { Highlight, ReadingLocation } from '../../../types/index.js';

// Setup pdfjs worker
try {
  if (pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }
} catch {
  if (pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  }
}

interface PdfViewerProps {
  documentId: string;
  currentPage: number;
  scale: number;
  isContinuous?: boolean;
  onPageChange?: (page: number, totalPages: number) => void;
  highlights?: Highlight[];
  onAddHighlight?: (location: ReadingLocation, textContent: string) => void;
  onDeleteHighlight?: (highlightId: string) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  documentId,
  currentPage,
  scale,
  isContinuous: _isContinuous = false,
  onPageChange,
  highlights = [],
  onAddHighlight,
  onDeleteHighlight,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({ width: 800, height: 1100 });

  // Text selection state for highlight popover
  const [selectionState, setSelectionState] = useState<{
    pageNumber: number;
    text: string;
    rects: { x: number; y: number; width: number; height: number }[];
    position: { top: number; left: number };
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // 1. Load PDF document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const fileUrl = documentsService.getDocumentFileUrl(documentId);
    const loadingTask = pdfjsLib.getDocument({
      url: fileUrl,
      withCredentials: false,
    });

    loadingTask.promise
      .then((loadedPdf: any) => {
        if (!isCancelled) {
          setPdfDoc(loadedPdf);
          setTotalPages(loadedPdf.numPages);
          if (onPageChange) {
            onPageChange(currentPage, loadedPdf.numPages);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          console.error('PDF loading error:', err);
          setError('Failed to load PDF document.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      loadingTask.destroy().catch(() => {});
    };
  }, [documentId]);

  // 2. Render active page on canvas (Single Page Mode)
  const renderPage = useCallback(
    async (pageNumber: number) => {
      if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const containerWidth = containerRef.current.clientWidth - 48; // comfortable margins
        const unscaledViewport = page.getViewport({ scale: 1 });

        // Calculate fit-to-width default or user zoom scale
        const fitScale = (containerWidth / unscaledViewport.width) * scale;
        const viewport = page.getViewport({ scale: Math.max(0.4, Math.min(3.0, fitScale)) });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        setPageSize({ width: viewport.width, height: viewport.height });

        ctx.save();
        ctx.scale(dpr, dpr);

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderTask = page.render({
          canvasContext: ctx,
          viewport,
        });
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        ctx.restore();
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    },
    [pdfDoc, scale]
  );

  useEffect(() => {
    if (pdfDoc && !loading) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, renderPage, loading]);

  // 3. Text Selection Listener for Highlights
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionState(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setSelectionState(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (!containerRect) return;

    // Normalize coordinates relative to page dimensions
    const normalizedRects = [{
      x: Math.max(0, (rect.left - containerRect.left) / pageSize.width),
      y: Math.max(0, (rect.top - containerRect.top) / pageSize.height),
      width: rect.width / pageSize.width,
      height: rect.height / pageSize.height,
    }];

    setSelectionState({
      pageNumber: currentPage,
      text,
      rects: normalizedRects,
      position: {
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left + rect.width / 2,
      },
    });
  };

  const handleConfirmHighlight = () => {
    if (!selectionState || !onAddHighlight) return;

    onAddHighlight(
      {
        type: 'pdf_page',
        value: {
          pageNumber: selectionState.pageNumber,
          totalPages,
          rects: selectionState.rects,
        } as any,
      },
      selectionState.text
    );

    window.getSelection()?.removeAllRanges();
    setSelectionState(null);
  };

  if (loading) {
    return (
      <div style={styles.viewerContainer}>
        <div style={styles.statusMessage}>Loading PDF pages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.viewerContainer}>
        <div style={{ ...styles.statusMessage, color: '#EF4444' }}>{error}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={styles.viewerContainer}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          ...styles.pageCard,
          width: `${pageSize.width}px`,
          height: `${pageSize.height}px`,
        }}
      >
        <canvas ref={canvasRef} style={styles.canvas} />

        <HighlightOverlay
          highlights={highlights}
          pageNumber={currentPage}
          scale={scale}
          pageWidth={pageSize.width}
          pageHeight={pageSize.height}
          onDeleteHighlight={onDeleteHighlight}
        />

        {selectionState && (
          <TextSelectionMenu
            position={selectionState.position}
            onHighlight={handleConfirmHighlight}
            onClose={() => setSelectionState(null)}
          />
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  viewerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 16px',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-app)',
    userSelect: 'text',
    position: 'relative',
  },
  pageCard: {
    position: 'relative',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '4px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    transition: 'box-shadow 200ms ease',
  },
  canvas: {
    display: 'block',
  },
  statusMessage: {
    marginTop: '60px',
    fontSize: '15px',
    color: 'var(--text-secondary)',
  },
};
