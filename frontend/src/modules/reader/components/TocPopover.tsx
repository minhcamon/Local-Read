import React from 'react';
import { MOCK_TOC, type TocChapter } from '../../../mock/mockData.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog.js';

interface TocPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onSelectChapter: (page: number) => void;
  bookTitle: string;
}

export const TocPopover: React.FC<TocPopoverProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectChapter,
  bookTitle,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-surface-container-lowest border-outline-variant/50 max-h-[85vh] flex flex-col">
        <DialogHeader className="border-b border-outline-variant/30 pb-3">
          <DialogTitle className="font-headline-sm text-lg text-primary font-normal">
            Mục lục tác phẩm
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant truncate">
            {bookTitle}
          </DialogDescription>
        </DialogHeader>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1 divide-y divide-outline-variant/20">
          {MOCK_TOC.map((ch: TocChapter) => {
            const isCurrent = Math.abs(currentPage - ch.page) < 20;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  onSelectChapter(ch.page);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-all text-left group ${
                  isCurrent
                    ? 'bg-surface-container text-primary font-medium'
                    : 'text-on-surface hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary">
                    {isCurrent ? 'bookmark' : 'article'}
                  </span>
                  <span className="font-headline-sm text-sm font-normal">
                    {ch.title}
                  </span>
                </div>
                <span className="font-sans text-xs text-on-surface-variant/80">
                  Trang {ch.page}
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
