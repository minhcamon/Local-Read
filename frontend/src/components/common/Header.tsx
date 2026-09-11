import React from 'react';
import type { ReadingTheme } from '../../types/index.js';

interface HeaderProps {
  currentTheme: ReadingTheme;
  onThemeChange: (theme: ReadingTheme) => void;
  onImportClick?: () => void;
  title?: string;
  onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onThemeChange,
  onImportClick,
  title = 'LocalRead',
  onBackClick,
}) => {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        {onBackClick && (
          <button style={styles.backBtn} onClick={onBackClick} title="Return to Library">
            ← Library
          </button>
        )}
        <h1 style={styles.title}>{title}</h1>
      </div>

      <div style={styles.right}>
        {/* Theme Switcher */}
        <div style={styles.themeGroup}>
          <button
            style={{
              ...styles.themeBtn,
              fontWeight: currentTheme === 'light' ? 700 : 400,
              borderBottom: currentTheme === 'light' ? '2px solid var(--accent-color)' : 'none',
            }}
            onClick={() => onThemeChange('light')}
          >
            Light
          </button>
          <button
            style={{
              ...styles.themeBtn,
              fontWeight: currentTheme === 'sepia' ? 700 : 400,
              borderBottom: currentTheme === 'sepia' ? '2px solid var(--accent-color)' : 'none',
            }}
            onClick={() => onThemeChange('sepia')}
          >
            Sepia
          </button>
          <button
            style={{
              ...styles.themeBtn,
              fontWeight: currentTheme === 'dark' ? 700 : 400,
              borderBottom: currentTheme === 'dark' ? '2px solid var(--accent-color)' : 'none',
            }}
            onClick={() => onThemeChange('dark')}
          >
            Dark
          </button>
        </div>

        {onImportClick && (
          <button style={styles.importBtn} onClick={onImportClick}>
            + Add Book
          </button>
        )}
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  backBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-app)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  themeGroup: {
    display: 'flex',
    gap: '8px',
  },
  themeBtn: {
    padding: '4px 8px',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  importBtn: {
    backgroundColor: 'var(--accent-color)',
    color: '#FFFFFF',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 500,
    fontSize: '0.9rem',
  },
};
