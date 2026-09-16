import React, { useState, useEffect } from 'react';
import { booksService } from '../../../services/books.service.js';
import { highlightsService } from '../../../services/highlights.service.js';
import type { Highlight } from '../../../types/index.js';

interface HighlightWithBook extends Highlight {
  bookTitle: string;
  bookId: string;
  author: string | null;
}

interface ThoughtsPageProps {
  onSelectBook: (bookId: string) => void;
}

export const ThoughtsPage: React.FC<ThoughtsPageProps> = ({ onSelectBook }) => {
  const [items, setItems] = useState<HighlightWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadAllThoughts() {
      try {
        const books = await booksService.getBooks();
        const allHighlights: HighlightWithBook[] = [];

        for (const book of books) {
          const docId = book.documents?.[0]?.id || book.primaryDocumentId;
          if (docId) {
            try {
              const highlights = await highlightsService.getHighlights(docId);
              for (const h of highlights) {
                allHighlights.push({
                  ...h,
                  bookTitle: book.title,
                  bookId: book.id,
                  author: book.author,
                });
              }
            } catch {
              // Ignore single book highlight error
            }
          }
        }

        if (isMounted) {
          // Sort newest first
          allHighlights.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setItems(allHighlights);
        }
      } catch (err) {
        console.error('Failed to load thoughts:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAllThoughts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.textContent.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.bookTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <>
      {/* Header */}
      <header className="pb-6 border-b border-outline-variant/30 space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-normal">
          Ghi chú & Trích dẫn
        </h1>
        <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-normal">
          {isLoading
            ? 'Đang tổng hợp suy ngẫm...'
            : `${items.length} đoạn văn & suy ngẫm đã lưu giữ`}
        </p>
      </header>

      {/* Filter bar */}
      {items.length > 0 && (
        <div className="pt-6 pb-4">
          <input
            type="text"
            placeholder="Lọc ghi chú theo từ khóa hoặc tên sách..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full px-3.5 py-2 bg-surface-container rounded border border-outline-variant/50 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary text-on-surface"
          />
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="py-12 space-y-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded bg-surface-container-low/50 space-y-3">
              <div className="h-4 bg-surface-container-high rounded w-1/3" />
              <div className="h-12 bg-surface-container-high rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* List of Quotes & Highlights */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="pt-6 space-y-6">
          {filteredItems.map((item) => {
            const pageNum = (item.location?.value as any)?.pageNumber || 1;
            return (
              <article
                key={item.id}
                className="p-6 rounded-lg bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-3.5 transition-all hover:border-outline-variant/70"
              >
                {/* Book Reference header */}
                <div className="flex items-center justify-between text-xs font-sans text-on-surface-variant">
                  <button
                    onClick={() => onSelectBook(item.bookId)}
                    className="font-serif font-medium text-sm text-primary hover:underline truncate max-w-sm text-left"
                  >
                    {item.bookTitle}
                  </button>
                  <span className="text-secondary font-mono text-[11px]">
                    Trang {pageNum}
                  </span>
                </div>

                {/* Highlighted text passage */}
                <blockquote className="p-3.5 rounded bg-[#FBF8F3] dark:bg-[#1E1E1E] border-l-3 border-[#8C6D58] font-serif text-sm sm:text-base leading-relaxed text-on-surface italic">
                  "{item.textContent}"
                </blockquote>

                {/* Optional user note */}
                {item.note && (
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed pl-1">
                    {item.note}
                  </p>
                )}

                {/* Timestamp & source author */}
                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-sans text-on-surface-variant/70">
                  <span>{item.author || 'Tác giả chưa rõ'}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <div className="py-24 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
            <span className="material-symbols-outlined text-[26px]">edit_note</span>
          </div>
          <p className="font-serif text-lg text-primary font-normal">
            Chưa có đoạn ghi chú nào
          </p>
          <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Trong lúc đọc tài liệu PDF, hãy bôi đen các đoạn trích ấn tượng và chọn "Đánh dấu" để tích lũy kho tri thức của bạn.
          </p>
        </div>
      )}
    </>
  );
};
