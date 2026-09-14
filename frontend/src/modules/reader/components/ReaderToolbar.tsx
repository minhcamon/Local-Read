import React from 'react';
import type { ReadingTheme } from '../../../types/index.js';

interface ReaderToolbarProps {
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onBack: () => void;
  isVisible: boolean;
  currentTheme?: ReadingTheme;
  onThemeChange?: (theme: ReadingTheme) => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  bookTitle,
  currentPage,
  totalPages,
  onPageChange,
  scale,
  onZoomIn,
  onZoomOut,
  onFitWidth,
  onBack,
  isVisible,
  currentTheme = 'light',
  onThemeChange,
}) => {
  return (
    <div
      style={{
        ...styles.toolbar,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-10px)',
      }}
    >
      <div style={styles.left}>
        <button style={styles.backBtn} onClick={onBack} title="Back to Library">
          ← Library
        </button>
        <span style={styles.bookTitle} title={bookTitle}>
          {bookTitle}
        </span>
      </div>

      {/* Pagination Controls */}
      <div style={styles.center}>
        <button
          style={styles.navBtn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Previous Page (← / PageUp)"
        >
          ‹
        </button>

        <div style={styles.pageInputGroup}>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) onPageChange(val);
            }}
            style={styles.pageInput}
          />
          <span style={styles.pageTotal}>/ {totalPages || 1}</span>
        </div>

        <button
          style={styles.navBtn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Next Page (→ / Space / PageDown)"
        >
          ›
        </button>
      </div>

      {/* Theme & Zoom Controls */}
      <div style={styles.right}>
        {onThemeChange && (
          <div style={styles.themeGroup}>
            <button
              style={{
                ...styles.themeBtn,
                border: currentTheme === 'light' ? '1.5px solid var(--accent-color)' : '1px solid var(--border-color)',
                backgroundColor: '#FFFFFF',
              }}
              onClick={() => onThemeChange('light')}
              title="Light Theme"
            >
              ☀️
            </button>
            <button
              style={{
                ...styles.themeBtn,
                border: currentTheme === 'sepia' ? '1.5px solid var(--accent-color)' : '1px solid var(--border-color)',
                backgroundColor: '#FBF0D9',
              }}
              onClick={() => onThemeChange('sepia')}
              title="Sepia Theme"
            >
              📜
            </button>
            <button
              style={{
                ...styles.themeBtn,
                border: currentTheme === 'dark' ? '1.5px solid var(--accent-color)' : '1px solid var(--border-color)',
                backgroundColor: '#1E1E1E',
              }}
              onClick={() => onThemeChange('dark')}
              title="Dark Theme"
            >
              🌙
            </button>
          </div>
        )}

        <button style={styles.zoomBtn} onClick={onZoomOut} title="Zoom Out (Ctrl -)">
          −
        </button>
        <span style={styles.zoomLabel}>{Math.round(scale * 100)}%</span>
        <button style={styles.zoomBtn} onClick={onZoomIn} title="Zoom In (Ctrl +)">
          +
        </button>
        <button style={styles.fitWidthBtn} onClick={onFitWidth} title="Fit to Width (W)">
          ↔ Fit
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    position: 'fixed',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    backgroundColor: 'var(--bg-toolbar)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '8px 16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: '920px',
    transition: 'opacity 250ms ease, transform 250ms ease',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  backBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-app)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  bookTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'var(--text-primary)',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-app)',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
  },
  pageInputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  pageInput: {
    width: '45px',
    padding: '4px',
    textAlign: 'center',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
  },
  pageTotal: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'flex-end',
    flex: 1,
  },
  themeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginRight: '6px',
  },
  themeBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    cursor: 'pointer',
    padding: 0,
  },
  zoomBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-app)',
    fontSize: '1rem',
    color: 'var(--text-primary)',
  },
  zoomLabel: {
    fontSize: '0.8rem',
    minWidth: '38px',
    textAlign: 'center',
    color: 'var(--text-primary)',
  },
  fitWidthBtn: {
    backgroundColor: 'var(--bg-app)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    color: 'var(--accent-color)',
    fontWeight: 500,
  },
};
