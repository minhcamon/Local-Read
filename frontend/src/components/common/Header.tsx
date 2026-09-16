import React, { useState } from 'react';
import type { ReadingTheme } from '../../types/index.js';
import { Button } from '../ui/button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog.js';

interface HeaderProps {
  currentTheme: ReadingTheme;
  onThemeChange: (theme: ReadingTheme) => void;
  onImportClick?: () => void;
  activeNav?: 'bookshelf' | 'thoughts' | 'connections';
  onNavChange?: (nav: 'bookshelf' | 'thoughts' | 'connections') => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onThemeChange,
  onImportClick,
  activeNav = 'bookshelf',
  onNavChange,
  searchQuery = '',
  onSearchChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
    setIsSearchOpen(false);
  };

  const handleToggleTheme = () => {
    // Cycle through themes: light -> ivory -> sepia -> dark -> light
    const themes: ReadingTheme[] = ['light', 'ivory', 'sepia', 'dark'];
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    onThemeChange(themes[nextIdx]);
  };

  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'dark':
        return 'dark_mode';
      case 'sepia':
        return 'menu_book';
      case 'ivory':
        return 'auto_stories';
      default:
        return 'light_mode';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-outline-variant/30 transition-colors select-none">
        <div className="h-16 max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => onNavChange?.('bookshelf')}
            className="group flex items-center gap-2.5 text-left text-primary hover:opacity-90 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="LocalRead Logo"
              className="w-7 h-7 object-contain rounded transition-transform group-hover:scale-105"
            />
            <span className="font-headline-sm text-headline-sm tracking-tight text-primary font-normal">
              LocalRead
            </span>
          </button>

          {/* Core Progression Navigation (Read -> Understand -> Connect) */}
          <nav className="flex items-center gap-8 font-label-md text-sm">
            <button
              onClick={() => onNavChange?.('bookshelf')}
              className={`pb-1 transition-all ${
                activeNav === 'bookshelf'
                  ? 'text-primary border-b border-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface border-b border-transparent'
              }`}
            >
              Tủ sách
            </button>
            <button
              onClick={() => onNavChange?.('thoughts')}
              className={`pb-1 transition-all ${
                activeNav === 'thoughts'
                  ? 'text-primary border-b border-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface border-b border-transparent'
              }`}
            >
              Ghi chú
            </button>
            <button
              onClick={() => onNavChange?.('connections')}
              className={`pb-1 transition-all ${
                activeNav === 'connections'
                  ? 'text-primary border-b border-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface border-b border-transparent'
              }`}
            >
              Mối nối
            </button>
          </nav>

          {/* Right Utilities: Search, Ex-Libris '+ Thêm sách', Theme Toggle, Monogram Stamp */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              aria-label="Tìm kiếm"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
              title="Tìm kiếm sách hoặc tác giả (Ấn /)"
            >
              <span className="material-symbols-outlined text-[19px]">search</span>
            </button>

            {/* Ex-Libris / Literary Tag '+ Thêm sách' */}
            {onImportClick && (
              <button
                onClick={onImportClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-serif italic text-primary border border-dashed border-outline-variant/70 hover:border-primary hover:bg-surface-container transition-all"
                title="Thêm tệp PDF vào thư viện"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span className="tracking-wide">Thêm sách</span>
              </button>
            )}

            {/* Delicate Theme toggle icon */}
            <button
              onClick={handleToggleTheme}
              className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
              title={`Chuyển giao diện đọc (Hiện tại: ${currentTheme})`}
            >
              <span className="material-symbols-outlined text-[19px]">{getThemeIcon()}</span>
            </button>

            {/* Monogram Library Stamp Avatar */}
            <div
              title="Thư viện cá nhân"
              className="w-6 h-6 rounded-xs border border-primary/50 bg-surface-container-highest/60 flex items-center justify-center text-primary text-[10px] font-serif font-bold tracking-wider select-none shadow-2xs"
            >
              LR
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-md bg-surface-container-lowest border-outline-variant/40">
          <DialogHeader>
            <DialogTitle className="font-headline-sm text-primary">Tìm kiếm trong tủ sách</DialogTitle>
            <DialogDescription className="text-on-surface-variant font-sans">
              Tìm kiếm nhanh theo tựa đề tác phẩm hoặc tác giả.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearchSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                autoFocus
                placeholder="Nhập tên sách, tác giả (ví dụ: Klara, Sapiens...)"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded border border-outline-variant/60 font-sans text-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange?.('');
                  setIsSearchOpen(false);
                }}
              >
                Xóa lọc
              </Button>
              <Button type="submit" variant="default">
                Tìm kiếm
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
