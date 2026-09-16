import React, { useState } from 'react';
import { Trash2, FileEdit, Network } from 'lucide-react';
import type { Book } from '../../../types/index.js';

interface BookCardProps {
  book: Book;
  onSelect: (bookId: string) => void;
  onDelete?: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const progressPercent = book.progressPercent ?? 0;
  const isCompleted = progressPercent >= 100 || book.category === 'finished';
  const isReading = progressPercent > 0 && !isCompleted;
  const isUnstarted = progressPercent === 0 && book.category === 'saved';

  // Highlight & Connection indicators (tầng Understand & Connect)
  const highlightsCount = (book.documents?.[0] as any)?.highlightsCount || (book as any).highlightsCount || 0;
  const connectionsCount = Math.max(0, Math.floor(highlightsCount / 2));

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa cuốn sách "${book.title}" khỏi thư viện?`)) {
      setIsDeleting(true);
      onDelete?.(book.id);
    }
  };

  const hasCustomCover = Boolean(book.coverUrl);

  return (
    <article
      onClick={() => onSelect(book.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(book.id);
        }
      }}
      tabIndex={0}
      className={`group relative flex flex-col cursor-pointer book-card focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs transition-all duration-300 select-none pt-2 ${
        isDeleting ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* Book Cover Container with Protruding Physical Bookmark Ribbon */}
      <div className="relative w-full aspect-2/3 transition-transform duration-300 group-hover:-translate-y-1">
        
        {/* Physical Silk Bookmark Ribbon (V-Cut Swallowtail ở đỉnh chóp) */}
        {isReading && (
          <div
            className="absolute left-3 -top-4 w-6 h-10 z-0 bg-[#964234] dark:bg-[#A64B3D] text-[#FDF6E2] shadow-xs flex flex-col items-center pt-3 transition-transform duration-280 pointer-events-none group-hover:-translate-y-5.5"
            style={{
              clipPath: 'polygon(0 0, 50% 30%, 100% 0, 100% 100%, 0 100%)',
              transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
            title={`Đang đọc dở • Trang ${book.currentPage || 1}`}
          >
            {/* Typewriter Microcopy: Hiện rõ số trang khi rút lên */}
            <span className="font-mono text-[8px] font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 select-none">
            </span>
          </div>
        )}

        {/* Main Book Cover Body (z-10, che phần thân dưới của ruy-băng) */}
        <div className="relative z-10 w-full h-full overflow-hidden rounded-xs bg-[#FBF8F3] dark:bg-[#222222] shadow-[1px_1px_0px_rgba(0,0,0,0.08),3px_5px_14px_-2px_rgba(44,38,34,0.14)] group-hover:shadow-[1px_2px_0px_rgba(0,0,0,0.1),6px_12px_24px_-3px_rgba(44,38,34,0.22)] border border-[#E6DDD0]/80 dark:border-[#333333] transition-shadow duration-300">
          {hasCustomCover ? (
            <img
              src={book.coverUrl!}
              alt={`Bìa sách ${book.title}`}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
              loading="lazy"
            />
          ) : (
            /* Procedural Typographic Cover — Warm Ivory Paper Tone with Craftsmanship Details */
            <div className="w-full h-full p-4 sm:p-5 flex flex-col justify-between bg-linear-to-b from-[#FBF8F3] via-[#F8F3EA] to-[#F1E9DC] dark:from-[#242424] dark:via-[#202020] dark:to-[#1A1A1A] text-primary transition-colors relative">
              
              {/* Top Minimal Seal / Blind Emboss Accent */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 opacity-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/25" />
                </div>
                {isReading && (
                  <span className="font-mono text-[10px] tracking-wider text-primary/75">
                    {progressPercent}%
                  </span>
                )}
                {isCompleted && (
                  <span className="font-serif italic text-[10px] text-secondary tracking-wide">
                    Đã đọc xong
                  </span>
                )}
              </div>

              {/* Central Book Typography on Cover */}
              <div className="space-y-2 my-auto pl-1">
                <h3 className="font-serif font-normal text-[15px] sm:text-[17px] leading-snug line-clamp-3 text-primary tracking-tight">
                  {book.title}
                </h3>
                <p className="font-serif italic text-[12px] text-on-surface-variant/85 line-clamp-1">
                  {book.author ? `— ${book.author}` : '— Tác giả chưa rõ'}
                </p>
              </div>

              {/* Bottom Ex-Libris Fine Ornament Line */}
              <div className="flex items-center gap-1.5 opacity-40">
                <div className="w-4 h-px bg-primary" />
                <div className="w-1 h-1 rotate-45 border border-primary" />
                <div className="w-4 h-px bg-primary" />
              </div>
            </div>
          )}

          {/* Left Book Spine 3D Crease & Seam Shadow */}
          <div className="absolute inset-y-0 left-0 w-3.5 book-spine-crease pointer-events-none" />
          <div className="absolute inset-y-0 left-3.5 w-px bg-black/5 dark:bg-white/5 pointer-events-none" />

          {/* Right Edge Paper Page-Leaf Hint */}
          <div className="absolute inset-y-0 right-0 w-0.5 bg-black/5 dark:bg-white/5 pointer-events-none" />

          {/* Hover Delete Action (Góc trên bên phải) */}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              title="Xóa sách khỏi thư viện"
              className="absolute top-2 right-2 w-6 h-6 rounded-xs bg-surface/90 text-error hover:bg-error hover:text-white backdrop-blur-xs border border-outline-variant/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* If custom image cover exists, show brief title; for procedural cover, avoid redundant text! */}
      {hasCustomCover && (
        <div className="mt-2 space-y-0.5">
          <h2 className="font-serif text-[15px] leading-snug text-on-surface font-normal line-clamp-1 group-hover:text-primary transition-colors">
            {book.title}
          </h2>
          <p className="font-serif italic text-xs text-on-surface-variant line-clamp-1">
            {book.author}
          </p>
        </div>
      )}

      {/* Literary Metadata: Page numbers & Understand / Connect cues */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-on-surface-variant/75 group-hover:text-on-surface-variant transition-colors">
        <span>
          {isCompleted
            ? 'Hoàn thành'
            : isUnstarted
            ? 'Chưa mở'
            : book.currentPage && book.totalPages
            ? `Trang ${book.currentPage}/${book.totalPages}`
            : `${progressPercent}%`}
        </span>

        {/* Understand & Connect subtle indicator: Ghi chú • Mối nối */}
        <div className="flex items-center gap-2.5 font-mono">
          {highlightsCount > 0 && (
            <span className="inline-flex items-center gap-1" title={`${highlightsCount} đoạn trích dẫn ghi chú`}>
              <FileEdit className="w-3 h-3 text-on-surface-variant/80" />
              <span>{highlightsCount}</span>
            </span>
          )}
          {connectionsCount > 0 && (
            <span className="inline-flex items-center gap-1" title={`${connectionsCount} mối nối tư tưởng`}>
              <Network className="w-3 h-3 text-on-surface-variant/80" />
              <span>{connectionsCount}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
