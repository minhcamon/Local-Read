import React, { useEffect, useState } from 'react';

interface GlobalDropOverlayProps {
  onFileDrop: (file: File) => void;
}

export const GlobalDropOverlay: React.FC<GlobalDropOverlayProps> = ({ onFileDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types?.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
          onFileDrop(file);
        } else {
          alert('Vui lòng chọn tệp PDF hợp lệ.');
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onFileDrop]);

  if (!isDragging) return null;

  return (
    <div
      aria-label="Kéo thả tệp PDF vào ứng dụng"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/85 backdrop-blur-sm border-4 border-dashed border-primary/40 pointer-events-none animate-in fade-in duration-150 select-none"
    >
      <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-surface-container-lowest/90 rounded-2xl shadow-paper-elevated border border-outline-variant/50 max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[36px]">upload_file</span>
        </div>
        <div className="space-y-1">
          <p className="font-headline-sm text-lg font-normal text-primary">
            Thả để thêm sách vào không gian đọc
          </p>
          <p className="font-sans text-xs text-on-surface-variant">
            Tự động lưu trữ cục bộ và sẵn sàng đọc ngay
          </p>
        </div>
      </div>
    </div>
  );
};
