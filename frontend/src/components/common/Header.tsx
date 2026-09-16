import React, { useState } from 'react';
import type { ReadingTheme } from '../../types/index.js';
import { Button } from '../ui/button.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog.js';

interface HeaderProps {
  currentTheme: ReadingTheme;
  onThemeChange: (theme: ReadingTheme) => void;
  onImportClick?: () => void;
  activeNav?: 'bookshelf' | 'recent' | 'notes';
  onNavChange?: (nav: 'bookshelf' | 'recent' | 'notes') => void;
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-outline-variant/40 transition-colors">
        <div className="h-16 max-w-5xl mx-auto px-6 flex items-center justify-between">
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

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 font-label-lg text-label-lg">
            <button
              onClick={() => onNavChange?.('bookshelf')}
              className={`transition-colors font-medium pb-0.5 ${
                activeNav === 'bookshelf'
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
              }`}
            >
              Tủ sách
            </button>
            <button
              onClick={() => onNavChange?.('recent')}
              className={`transition-colors pb-0.5 ${
                activeNav === 'recent'
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
              }`}
            >
              Đọc gần đây
            </button>
            <button
              onClick={() => onNavChange?.('notes')}
              className={`transition-colors pb-0.5 ${
                activeNav === 'notes'
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'
              }`}
            >
              Ghi chép
            </button>
          </nav>

          {/* Actions: Search & Profile & Quick Add */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Tìm kiếm sách"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              title="Tìm kiếm sách hoặc tác giả"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Quick Import button in header */}
            {onImportClick && (
              <Button
                variant="dashed"
                size="sm"
                onClick={onImportClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Thêm sách</span>
              </Button>
            )}

            {/* Reading Theme Toggle */}
            <div className="flex items-center bg-surface-container rounded p-0.5 border border-outline-variant/30">
              <button
                onClick={() => onThemeChange('light')}
                className={`p-1.5 rounded transition-all ${
                  currentTheme === 'light' || currentTheme === 'ivory'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Tông giấy sáng / ngà ấm"
              >
                <span className="material-symbols-outlined text-[16px]">light_mode</span>
              </button>
              <button
                onClick={() => onThemeChange('sepia')}
                className={`p-1.5 rounded transition-all ${
                  currentTheme === 'sepia'
                    ? 'bg-surface-container-lowest text-secondary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Tông giấy Sepia cổ điển"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-1.5 rounded transition-all ${
                  currentTheme === 'dark'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Tông đọc đêm tĩnh mịch"
              >
                <span className="material-symbols-outlined text-[16px]">dark_mode</span>
              </button>
            </div>

            {/* Avatar / Profile indicator */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-md bg-surface-container-lowest border-outline-variant/40">
          <DialogHeader>
            <DialogTitle className="font-headline-sm">Tìm kiếm trong tủ sách</DialogTitle>
            <DialogDescription>
              Tìm kiếm nhanh theo tựa đề tác phẩm, tác giả hoặc nội dung ghi chép.
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
