import React from 'react';
import type { ReadingTheme } from '../../../types/index.js';
import { Slider } from '../../../components/ui/slider.js';

interface TypographyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  lineHeight: 'tight' | 'normal' | 'relaxed';
  onLineHeightChange: (lh: 'tight' | 'normal' | 'relaxed') => void;
  currentTheme: ReadingTheme;
  onThemeChange: (theme: ReadingTheme) => void;
  fontFamily: 'serif' | 'sans';
  onFontFamilyChange: (f: 'serif' | 'sans') => void;
}

export const TypographyDrawer: React.FC<TypographyDrawerProps> = ({
  isOpen,
  onClose,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
  currentTheme,
  onThemeChange,
  fontFamily,
  onFontFamilyChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-14 right-6 sm:right-12 z-50 bg-surface-container-lowest p-5 rounded-xl shadow-paper-elevated border border-outline-variant/40 w-80 flex flex-col gap-5 text-on-surface font-sans animate-in fade-in zoom-in-95 duration-150"
      id="typo-drawer"
    >
      {/* Header */}
      <div className="flex justify-between items-center text-on-surface border-b border-outline-variant/20 pb-3">
        <span className="font-headline-sm text-base font-normal text-primary">
          Cài đặt hiển thị trang đọc
        </span>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container"
          aria-label="Đóng cài đặt"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Font Size Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Cỡ chữ đọc</span>
          <span className="font-semibold text-primary font-sans">{fontSize}px</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant">A</span>
          <Slider
            value={[fontSize]}
            min={15}
            max={24}
            step={1}
            onValueChange={(val) => onFontSizeChange(val[0])}
            className="w-full"
          />
          <span className="text-base font-medium text-on-surface-variant">A</span>
        </div>
      </div>

      {/* Line Spacing */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-on-surface-variant">Khoảng cách dòng</span>
        <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded">
          <button
            onClick={() => onLineHeightChange('tight')}
            className={`py-1 text-center rounded text-xs transition-all ${
              lineHeight === 'tight'
                ? 'bg-surface-container-lowest text-primary font-medium shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
            }`}
          >
            Gọn
          </button>
          <button
            onClick={() => onLineHeightChange('normal')}
            className={`py-1 text-center rounded text-xs transition-all ${
              lineHeight === 'normal'
                ? 'bg-surface-container-lowest text-primary font-medium shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
            }`}
          >
            Vừa (Chuẩn)
          </button>
          <button
            onClick={() => onLineHeightChange('relaxed')}
            className={`py-1 text-center rounded text-xs transition-all ${
              lineHeight === 'relaxed'
                ? 'bg-surface-container-lowest text-primary font-medium shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
            }`}
          >
            Rộng
          </button>
        </div>
      </div>

      {/* Font Family */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-on-surface-variant">Kiểu phông chữ</span>
        <div className="grid grid-cols-2 gap-1 bg-surface-container p-1 rounded">
          <button
            onClick={() => onFontFamilyChange('serif')}
            className={`py-1.5 text-center rounded text-xs font-serif transition-all ${
              fontFamily === 'serif'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
            }`}
          >
            Newsreader (Serif)
          </button>
          <button
            onClick={() => onFontFamilyChange('sans')}
            className={`py-1.5 text-center rounded text-xs font-sans transition-all ${
              fontFamily === 'sans'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-lowest/60'
            }`}
          >
            Jakarta Sans
          </button>
        </div>
      </div>

      {/* Reading Tones Palette */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-on-surface-variant">Tông giấy đọc</span>
        <div className="grid grid-cols-4 gap-2">
          {/* Light Natural */}
          <button
            onClick={() => onThemeChange('light')}
            className={`flex flex-col items-center gap-1 p-2 rounded border transition-all ${
              currentTheme === 'light'
                ? 'border-primary ring-1 ring-primary bg-white'
                : 'border-outline-variant/50 bg-white hover:border-primary/60'
            }`}
            title="Trắng tự nhiên"
          >
            <div className="w-5 h-5 rounded-full bg-[#FFFFFF] border border-gray-300" />
            <span className="text-[10px] text-gray-800">Trắng</span>
          </button>

          {/* Warm Ivory */}
          <button
            onClick={() => onThemeChange('ivory')}
            className={`flex flex-col items-center gap-1 p-2 rounded border transition-all ${
              currentTheme === 'ivory'
                ? 'border-primary ring-1 ring-primary bg-[#FBF8F3]'
                : 'border-outline-variant/50 bg-[#FBF8F3] hover:border-primary/60'
            }`}
            title="Giấy ngà ấm (Quiet Library)"
          >
            <div className="w-5 h-5 rounded-full bg-[#FBF8F3] border border-[#DDD5C7]" />
            <span className="text-[10px] text-[#2C2825]">Giấy ngà</span>
          </button>

          {/* Sepia Classic */}
          <button
            onClick={() => onThemeChange('sepia')}
            className={`flex flex-col items-center gap-1 p-2 rounded border transition-all ${
              currentTheme === 'sepia'
                ? 'border-secondary ring-1 ring-secondary bg-[#F4E8C1]'
                : 'border-outline-variant/50 bg-[#F4E8C1] hover:border-secondary/60'
            }`}
            title="Sepia cổ điển"
          >
            <div className="w-5 h-5 rounded-full bg-[#FBF0D9] border border-[#E5D5B3]" />
            <span className="text-[10px] text-[#433422]">Sepia</span>
          </button>

          {/* Dark Charcoal */}
          <button
            onClick={() => onThemeChange('dark')}
            className={`flex flex-col items-center gap-1 p-2 rounded border transition-all ${
              currentTheme === 'dark'
                ? 'border-primary-fixed ring-1 ring-primary-fixed bg-[#1E1E1E]'
                : 'border-outline-variant/50 bg-[#1E1E1E] hover:border-primary-fixed/60'
            }`}
            title="Đêm tĩnh mịch"
          >
            <div className="w-5 h-5 rounded-full bg-[#141414] border border-[#333333]" />
            <span className="text-[10px] text-[#E2E8F0]">Đêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
