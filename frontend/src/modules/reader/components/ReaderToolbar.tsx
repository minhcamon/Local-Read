import React from 'react';

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
}) => {
  return (
    <div
      style={{
        ...styles.toolbar,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
      }}
    >
      <div style={styles.left}>
        <button style={styles.backBtn} onClick={onBack}>
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
        >
          ›
        </button>
      </div>

      {/* Zoom & Viewport Controls */}
      <div style={styles.right}>
        <button style={styles.zoomBtn} onClick={onZoomOut} title="Zoom Out (Ctrl -)">
          −
        </button>
        <span style={styles.zoomLabel}>{Math.round(scale * 100)}%</span>
        <button style={styles.zoomBtn} onClick={onZoomIn} title="Zoom In (Ctrl +)">
          +
        </button>
        <button style={styles.fitWidthBtn} onClick={onFitWidth} title="Fit to Width (W)">
          ↔ Fit Width
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
    backdropFilter: 'blur(8px)',
    borderRadius: '10px',
    padding: '8px 16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: '900px',
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
  },
  bookTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    maxWidth: '220px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    minWidth: '40px',
    textAlign: 'center',
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
