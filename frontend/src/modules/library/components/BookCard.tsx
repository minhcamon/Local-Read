import React, { useState } from 'react';
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
  const isUnstarted = progressPercent === 0 && book.category === 'saved';

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa cuốn sách "${book.title}" khỏi thư viện?`)) {
      setIsDeleting(true);
      onDelete?.(book.id);
    }
  };

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
      className={`group relative flex flex-col cursor-pointer book-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1 transition-opacity ${
        isDeleting ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* Book Cover Container with Spine Shadow and Archival Border */}
      <div className="relative w-full aspect-[2/3] mb-3.5 overflow-hidden rounded-[2px] bg-surface-container shadow-sm border border-outline-variant/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Bìa sách ${book.title}`}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
            loading="lazy"
          />
        ) : (
          /* Typographic Elegant Cover Fallback */
          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-surface-container-high to-surface-container-low text-primary select-none">
            <div className="space-y-1">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary opacity-75">
                LocalRead PDF
              </span>
              <h3 className="font-serif font-medium text-sm sm:text-base leading-tight line-clamp-3">
                {book.title}
              </h3>
            </div>
            <p className="font-sans text-[11px] text-on-surface-variant truncate">
              {book.author || 'Tác giả chưa cập nhật'}
            </p>
          </div>
        )}

        {/* Left Book Spine Shadow Gradient */}
        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

        {/* Delete Quick Action Button (Visible on hover) */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            title="Xóa sách khỏi thư viện"
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-surface/90 text-error hover:bg-error hover:text-white backdrop-blur-xs border border-outline-variant/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <span className="material-symbols-outlined text-[15px]">delete</span>
          </button>
        )}

        {/* Subtle bookmark tag if currently reading */}
        {progressPercent > 0 && progressPercent < 100 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface/90 backdrop-blur-xs border border-outline-variant/40 font-label-sm text-[10px] text-primary tracking-wider font-semibold">
            {progressPercent}%
          </div>
        )}
      </div>

      {/* Book Metadata */}
      <div className="space-y-1">
        <h2 className="font-headline-sm text-[17px] leading-tight text-on-surface font-normal line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h2>
        <p className="font-label-md text-label-md text-on-surface-variant line-clamp-1">
          {book.author || 'Tác giả chưa cập nhật'}
        </p>
      </div>

      {/* Reading Progress Line */}
      <div
        className={`mt-3 w-full h-[2px] bg-surface-container-highest rounded-full overflow-hidden ${
          isUnstarted ? 'opacity-40' : ''
        }`}
        title={
          isCompleted
            ? 'Đã hoàn thành (100%)'
            : isUnstarted
            ? 'Chưa bắt đầu đọc'
            : `Tiến độ: ${progressPercent}% (trang ${book.currentPage || 1}/${book.totalPages || 1})`
        }
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCompleted
              ? 'bg-secondary w-full'
              : isUnstarted
              ? 'w-0'
              : 'bg-primary-container'
          }`}
          style={{ width: isCompleted ? '100%' : `${progressPercent}%` }}
        />
      </div>
      <span className="sr-only">
        {isCompleted
          ? 'Đã hoàn thành'
          : isUnstarted
          ? 'Chưa đọc'
          : `Đã đọc ${progressPercent}%`}
      </span>
    </article>
  );
};
