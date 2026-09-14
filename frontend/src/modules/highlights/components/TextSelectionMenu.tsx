import React from 'react';
import { Highlighter } from 'lucide-react';

interface TextSelectionMenuProps {
  position: { top: number; left: number };
  onHighlight: () => void;
  onClose: () => void;
}

export const TextSelectionMenu: React.FC<TextSelectionMenuProps> = ({
  position,
  onHighlight,
}) => {
  return (
    <div
      style={{
        ...styles.menu,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseDown={(e) => {
        // Prevent selection from clearing when clicking the button
        e.preventDefault();
      }}
    >
      <button style={styles.highlightBtn} onClick={onHighlight}>
        <Highlighter size={14} color="#D97706" />
        <span>Highlight</span>
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  menu: {
    position: 'absolute',
    transform: 'translate(-50%, -100%) translateY(-8px)',
    zIndex: 100,
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  },
  highlightBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    borderRadius: '4px',
    transition: 'background-color 150ms ease',
  },
};
