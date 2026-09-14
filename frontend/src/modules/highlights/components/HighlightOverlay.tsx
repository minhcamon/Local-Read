import React from 'react';
import type { Highlight } from '../../../types/index.js';

interface HighlightOverlayProps {
  highlights: Highlight[];
  pageNumber: number;
  scale: number;
  pageWidth: number;
  pageHeight: number;
  onDeleteHighlight?: (id: string) => void;
}

export const HighlightOverlay: React.FC<HighlightOverlayProps> = ({
  highlights,
  pageNumber,
  pageWidth,
  pageHeight,
  onDeleteHighlight,
}) => {
  const pageHighlights = highlights.filter(
    (h) => (h.location.value as any)?.pageNumber === pageNumber
  );

  if (pageHighlights.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {pageHighlights.map((hl) => {
        const rects = (hl.location.value as any)?.rects as
          | { x: number; y: number; width: number; height: number }[]
          | undefined;

        if (!rects || rects.length === 0) return null;

        return (
          <React.Fragment key={hl.id}>
            {rects.map((rect, idx) => (
              <div
                key={`${hl.id}-${idx}`}
                title={hl.textContent}
                style={{
                  position: 'absolute',
                  left: `${rect.x * pageWidth}px`,
                  top: `${rect.y * pageHeight}px`,
                  width: `${rect.width * pageWidth}px`,
                  height: `${rect.height * pageHeight}px`,
                  backgroundColor: hl.color || 'rgba(250, 204, 21, 0.35)',
                  borderRadius: '2px',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  mixBlendMode: 'multiply',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDeleteHighlight && window.confirm('Delete this highlight?')) {
                    onDeleteHighlight(hl.id);
                  }
                }}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};
