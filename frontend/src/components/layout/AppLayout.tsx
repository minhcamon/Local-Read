import React from 'react';
import type { ReadingTheme } from '../../types/index.js';
import { Header } from '../common/Header.js';
import { GlobalDropOverlay } from '../common/GlobalDropOverlay.js';

interface AppLayoutProps {
  children: React.ReactNode;
  currentTheme: ReadingTheme;
  onThemeChange: (theme: ReadingTheme) => void;
  activeNav: 'bookshelf' | 'thoughts' | 'connections';
  onNavChange: (nav: 'bookshelf' | 'thoughts' | 'connections') => void;
  onImportClick?: () => void;
  onFileDrop?: (file: File) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  maxWidthClass?: string; // Default to max-w-6xl
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentTheme,
  onThemeChange,
  activeNav,
  onNavChange,
  onImportClick,
  onFileDrop,
  searchQuery = '',
  onSearchChange,
  maxWidthClass = 'max-w-6xl',
}) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between selection:bg-primary-container selection:text-on-primary select-none relative">
      {/* Global Subtle Paper Grain / Noise Overlay */}
      <div className="paper-noise fixed inset-0 pointer-events-none z-50 opacity-40 mix-blend-multiply dark:mix-blend-screen" />

      {/* Global Drag & Drop Overlay */}
      {onFileDrop && <GlobalDropOverlay onFileDrop={onFileDrop} />}

      {/* Unified Top Navigation Header (Fixed Top) */}
      <Header
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onImportClick={onImportClick}
        activeNav={activeNav}
        onNavChange={onNavChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Main Content Area (with top and bottom padding for fixed header & footer) */}
      <main className="w-full pt-16 pb-16 flex-1 flex flex-col relative z-10">
        <div className={`w-full ${maxWidthClass} mx-auto px-6 sm:px-8 py-6 sm:py-8 flex-1 flex flex-col`}>
          {children}
        </div>
      </main>

      {/* Frozen Footer (Fixed Bottom) with Typewriter microcopy */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-sm border-t border-outline-variant/30 py-2.5 select-none transition-colors">
        <div className={`w-full ${maxWidthClass} mx-auto px-6 sm:px-8 flex items-center justify-between text-[11px] font-mono text-on-surface-variant/70`}>
          <span className="font-serif italic text-xs tracking-wide text-primary/80">LocalRead</span>
          <span className="flex items-center gap-1.5 text-[11px]">
            Ấn <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/50 font-mono text-[10px] shadow-2xs text-primary font-bold">/</kbd> để tìm kiếm
          </span>
        </div>
      </footer>
    </div>
  );
};
