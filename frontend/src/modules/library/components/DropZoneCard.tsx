import React, { useRef, useState } from 'react';

interface DropZoneCardProps {
  onFileSelect: (files: FileList) => void;
  isUploading?: boolean;
}

export const DropZoneCard: React.FC<DropZoneCardProps> = ({ onFileSelect, isUploading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isUploading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex flex-col items-center justify-center p-6 text-center cursor-pointer aspect-[2/3] rounded-[2px] border border-dashed transition-all duration-200 ${
        isDragOver
          ? 'border-primary bg-surface-container scale-[1.02]'
          : 'border-outline/50 hover:border-primary bg-surface-container-low/60 hover:bg-surface-container-low'
      } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
      id="drop-zone"
      tabIndex={0}
      role="button"
      aria-label="Kéo thả file PDF vào đây để thêm vào thư viện"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple={false}
        className="hidden"
        id="book-file-input"
        onChange={handleInputChange}
      />
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-high/60 flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[22px]">
            {isUploading ? 'hourglass_top' : 'add'}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface leading-relaxed max-w-[140px] transition-colors select-none">
          {isUploading ? 'Đang nạp file...' : 'Kéo thả file PDF vào đây để thêm vào thư viện'}
        </p>
      </div>
    </div>
  );
};
