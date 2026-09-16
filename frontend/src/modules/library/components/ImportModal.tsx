import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog.js';
import { Button } from '../../../components/ui/button.js';
import { booksService } from '../../../services/books.service.js';
import type { Book } from '../../../types/index.js';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (book: Book) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        setSelectedFile(file);
        if (!title) {
          setTitle(file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
        }
      } else {
        setErrorMessage('Vui lòng chọn tệp định dạng PDF hợp lệ.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const createdBook = await booksService.importBook(
        selectedFile,
        title.trim() || undefined,
        author.trim() || undefined
      );

      setIsUploading(false);
      setSelectedFile(null);
      setTitle('');
      setAuthor('');
      onClose();

      if (onImportSuccess) {
        onImportSuccess(createdBook);
      }
    } catch (err: any) {
      setIsUploading(false);
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi nạp tệp PDF.';
      setErrorMessage(msg);
    }
  };

  const handleModalClose = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setTitle('');
    setAuthor('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="max-w-md bg-surface-container-lowest border-outline-variant/50">
        <DialogHeader>
          <DialogTitle className="font-headline-sm text-primary">Thêm sách mới vào thư viện</DialogTitle>
          <DialogDescription className="text-on-surface-variant font-sans">
            Chọn tệp PDF từ máy tính để lưu trữ trên máy cá nhân và đọc ngoại tuyến.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="p-3 bg-error-container text-error rounded text-xs font-sans">
            {errorMessage}
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all text-center cursor-pointer ${
            isDragOver
              ? 'border-primary bg-surface-container'
              : 'border-outline-variant hover:border-primary bg-surface-container-low/50'
          }`}
          onClick={() => document.getElementById('modal-file-upload')?.click()}
        >
          <input
            id="modal-file-upload"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-3">
            <span className="material-symbols-outlined text-[28px]">
              {selectedFile ? 'description' : 'upload_file'}
            </span>
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <p className="font-sans font-medium text-primary truncate max-w-[260px]">
                {selectedFile.name}
              </p>
              <p className="font-sans text-xs text-on-surface-variant">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Sẵn sàng nạp vào tủ sách
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-sans text-sm font-medium text-on-surface">
                Kéo thả file vào đây hoặc <span className="text-primary underline">chọn tệp</span>
              </p>
              <p className="font-sans text-xs text-on-surface-variant">
                Hỗ trợ định dạng PDF (Tối đa 100MB)
              </p>
            </div>
          )}
        </div>

        {/* Optional Metadata Inputs */}
        {selectedFile && (
          <div className="space-y-3 font-sans text-sm pt-2">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Tiêu đề sách
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề sách..."
                className="w-full px-3 py-2 rounded bg-surface border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Tác giả (tùy chọn)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Tên tác giả..."
                className="w-full px-3 py-2 rounded bg-surface border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="ghost" onClick={handleModalClose} disabled={isUploading}>
            Hủy bỏ
          </Button>
          <Button
            variant="default"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Đang nạp...' : 'Nạp vào thư viện'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
