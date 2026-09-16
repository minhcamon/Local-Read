import React, { useState, useEffect } from 'react';
import { booksService } from '../../../services/books.service.js';
import type { Book } from '../../../types/index.js';

interface ConnectionsPageProps {
  onSelectBook: (bookId: string) => void;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({ onSelectBook }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    booksService
      .getBooks()
      .then((data) => {
        if (isMounted) setBooks(data);
      })
      .catch((err) => console.error('Failed to load books for connections:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header className="pb-6 border-b border-outline-variant/30 space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-normal">
          Mối nối ý niệm
        </h1>
        <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-normal">
          Khám phá những giao thoa tư tưởng giữa các cuốn sách bạn đã đọc
        </p>
      </header>

      {/* Introduction Philosophy Card */}
      <div className="mt-8 p-6 rounded-xl bg-surface-container-low/40 border border-outline-variant/30 space-y-3">
        <div className="flex items-center gap-2 text-secondary font-serif text-sm">
          <span className="material-symbols-outlined text-[18px]">hub</span>
          <span>Triết lý: Read → Understand → Connect</span>
        </div>
        <p className="font-serif text-sm sm:text-base text-on-surface leading-relaxed italic">
          "Đọc không dừng lại ở từng trang sách riêng rẽ. Khi nhiều nguồn tri thức gặp gỡ, những liên kết ngầm giữa các tác giả sẽ dần hiện rõ trong tâm trí người đọc."
        </p>
      </div>

      {/* Connected Sources Map */}
      <div className="mt-10 space-y-6">
        <h2 className="font-serif text-lg text-primary font-normal">
          Tác phẩm trong mạng lưới ({books.length})
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 bg-surface-container-high rounded-lg" />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book.id)}
                className="p-5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-outline-variant transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-secondary">
                    {book.progressPercent || 0}% hoàn thành
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
                    arrow_forward
                  </span>
                </div>
                <h3 className="font-serif font-medium text-base text-primary line-clamp-1 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-1">
                  {book.author || 'Tác giả chưa rõ'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <p className="font-serif text-base text-primary">Chưa có tác phẩm nào</p>
            <p className="font-sans text-xs text-on-surface-variant">
              Hãy thêm sách vào Tủ sách để bắt đầu xây dựng mạng lưới ý niệm.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
