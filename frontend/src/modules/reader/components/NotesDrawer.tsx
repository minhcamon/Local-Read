import React, { useState } from 'react';
import type { Highlight } from '../../../types/index.js';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  highlights?: Highlight[];
  onDeleteHighlight?: (highlightId: string) => void;
  onJumpToPage?: (pageNumber: number) => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({
  isOpen,
  onClose,
  bookTitle,
  highlights = [],
  onDeleteHighlight,
  onJumpToPage,
}) => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'about'>('highlights');

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Panel ghi chép và highlights"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface-container-lowest border-l border-outline-variant/40 shadow-paper-elevated flex flex-col font-sans transition-all duration-300 animate-in slide-in-from-right"
    >
      {/* Drawer Header */}
      <div className="h-16 px-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/40">
        <div>
          <h2 className="font-headline-sm text-base text-primary font-normal">
            Ghi chép & Đánh dấu
          </h2>
          <p className="text-xs text-on-surface-variant truncate max-w-[280px]">
            {bookTitle}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          aria-label="Đóng panel"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-outline-variant/30 px-6 font-label-md text-xs bg-surface-container-lowest">
        <button
          onClick={() => setActiveTab('highlights')}
          className={`py-3 px-2 border-b-2 font-medium transition-all ${
            activeTab === 'highlights'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Đoạn đánh dấu ({highlights.length})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`py-3 px-2 border-b-2 font-medium transition-all ${
            activeTab === 'about'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Thông tin sách
        </button>
      </div>

      {/* Drawer Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'highlights' && (
          <div className="space-y-4">
            {highlights.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <span className="material-symbols-outlined text-[32px] text-secondary">
                  ink_highlighter
                </span>
                <p className="text-sm font-medium text-on-surface">Chưa có đoạn đánh dấu nào</p>
                <p className="text-xs text-on-surface-variant max-w-[240px] mx-auto">
                  Bôi đen đoạn văn bản trên trang PDF và bấm "Đánh dấu" để lưu lại những câu từ ấn tượng.
                </p>
              </div>
            ) : (
              highlights.map((h) => {
                const pageNum = (h.location?.value as any)?.pageNumber || 1;
                return (
                  <article
                    key={h.id}
                    className="p-4 rounded bg-surface-container-low/60 border border-outline-variant/30 space-y-2.5 transition-all hover:border-outline-variant group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                      <button
                        onClick={() => onJumpToPage?.(pageNum)}
                        className="font-medium text-secondary hover:text-primary underline cursor-pointer"
                        title="Nhảy đến trang này"
                      >
                        Trang {pageNum}
                      </button>
                      <div className="flex items-center gap-2">
                        {onDeleteHighlight && (
                          <button
                            onClick={() => onDeleteHighlight(h.id)}
                            className="opacity-0 group-hover:opacity-100 text-error hover:underline text-[11px] transition-opacity"
                            title="Xóa đánh dấu này"
                          >
                            Xóa
                          </button>
                        )}
                        <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Highlighted text snippet */}
                    <div
                      className="p-2.5 rounded border-l-3 text-xs font-serif text-on-surface leading-relaxed italic"
                      style={{
                        backgroundColor: 'rgba(250, 204, 21, 0.15)',
                        borderColor: h.color || '#FACC15',
                      }}
                    >
                      "{h.textContent}"
                    </div>

                    {/* Optional Note */}
                    {h.note && (
                      <p className="text-xs font-sans text-on-surface-variant leading-relaxed pl-1">
                        {h.note}
                      </p>
                    )}
                  </article>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4 text-xs font-sans text-on-surface-variant">
            <div className="p-4 rounded bg-surface-container-low/50 border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-sm text-sm text-primary font-medium">{bookTitle}</h3>
              <p>Tài liệu PDF được nạp cục bộ trên thiết bị của bạn.</p>
              <p className="pt-2 border-t border-outline-variant/20 text-[11px]">
                Tiến độ đọc và các đoạn đánh dấu được tự động đồng bộ và lưu trữ an toàn trong cơ sở dữ liệu SQLite cục bộ.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
