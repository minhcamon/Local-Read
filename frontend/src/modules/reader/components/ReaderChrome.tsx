import React from 'react';
import type { Book } from '../../../types/index.js';

interface ReaderChromeProps {
  book: Book;
  onBack: () => void;
  viewMode: 'single' | 'double';
  onViewModeChange: (mode: 'single' | 'double') => void;
  onToggleToc: () => void;
  onToggleTypo: () => void;
  onToggleTone: () => void;
  onToggleNotes: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isNotesOpen?: boolean;
  currentPage?: number;
  totalPages?: number;
  scale?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitWidth?: () => void;
}

export const ReaderChrome: React.FC<ReaderChromeProps> = ({
  book,
  onBack,
  viewMode,
  onViewModeChange,
  onToggleToc: _onToggleToc,
  onToggleTypo,
  onToggleTone,
  onToggleNotes,
  isBookmarked,
  onToggleBookmark,
  isNotesOpen = false,
  currentPage = 1,
  totalPages = 1,
  scale = 1,
  onZoomIn,
  onZoomOut,
  onFitWidth,
}) => {
  return (
    <aside className="sticky top-0 z-40 w-full bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 transition-all duration-300 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
        {/* Left: Back to Bookshelf & Current Book */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm tracking-wider uppercase"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Thư viện</span>
          </button>
          <span className="text-outline-variant/60 select-none">•</span>
          <div className="flex items-center gap-2 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
            <span className="font-headline-sm text-headline-sm font-normal text-on-surface tracking-normal truncate">
              {book.title}
            </span>
            {book.author && (
              <>
                <span className="text-outline text-xs">/</span>
                <span className="font-body-md text-body-md italic text-secondary truncate">
                  {book.author}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Page indicator & Zoom Controls (Laptop Ergonomics) */}
        <div className="hidden md:flex items-center gap-2 font-sans text-xs">
          <span className="font-medium text-secondary">
            Trang {currentPage} / {totalPages}
          </span>
          <div className="flex items-center bg-surface-container-high/60 rounded p-0.5 border border-outline-variant/30">
            {onZoomOut && (
              <button
                onClick={onZoomOut}
                title="Thu nhỏ (Ctrl -)"
                className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
            )}
            <span className="px-1.5 text-[11px] font-mono text-on-surface">
              {Math.round(scale * 100)}%
            </span>
            {onZoomIn && (
              <button
                onClick={onZoomIn}
                title="Phóng to (Ctrl +)"
                className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            )}
            {onFitWidth && (
              <button
                onClick={onFitWidth}
                title="Vừa chiều ngang màn hình (W)"
                className="px-1.5 py-0.5 ml-0.5 hover:bg-surface-container rounded text-[11px] text-on-surface-variant hover:text-primary transition-colors"
              >
                Fit-Width
              </button>
            )}
          </div>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-1">
          {/* Layout Mode (1 Trang vs 2 Trang) */}
          <div className="hidden sm:flex items-center p-0.5 bg-surface-container-high rounded gap-0.5 border border-outline-variant/30 mr-1">
            <button
              onClick={() => onViewModeChange('single')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'single'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="1 Trang cuộn tập trung"
            >
              <span className="material-symbols-outlined text-[16px]">article</span>
            </button>
            <button
              onClick={() => onViewModeChange('double')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'double'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="2 Trang song song"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
            </button>
          </div>

          {/* Typography Settings */}
          <button
            onClick={onToggleTypo}
            className="p-2 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
            title="Cỡ chữ và định dạng đọc"
          >
            <span className="material-symbols-outlined text-[19px]">format_size</span>
          </button>

          {/* Paper Tone Toggle */}
          <button
            onClick={onToggleTone}
            className="p-2 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
            title="Chuyển tông màu đọc (Sáng / Ngà / Tối)"
          >
            <span className="material-symbols-outlined text-[19px]">palette</span>
          </button>

          {/* Bookmark Current Page */}
          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
              isBookmarked ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
            title={isBookmarked ? 'Đã đánh dấu trang này' : 'Đánh dấu trang hiện tại'}
          >
            <span
              className={`material-symbols-outlined text-[19px] ${
                isBookmarked ? 'fill text-primary' : ''
              }`}
            >
              bookmark
            </span>
          </button>

          {/* Notes Drawer Toggle */}
          <button
            onClick={onToggleNotes}
            className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
              isNotesOpen ? 'bg-surface-container text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
            title="Ghi chép và danh sách Highlights"
          >
            <span className="material-symbols-outlined text-[19px]">edit_note</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
