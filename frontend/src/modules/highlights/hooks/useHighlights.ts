import { useState, useEffect, useCallback } from 'react';
import { highlightsService } from '../../../services/highlights.service.js';
import type { Highlight, ReadingLocation } from '../../../types/index.js';

export function useHighlights(documentId: string | null) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHighlights = useCallback(async () => {
    if (!documentId) return;
    try {
      setIsLoading(true);
      const data = await highlightsService.getHighlights(documentId);
      setHighlights(data || []);
    } catch (err) {
      console.error('Failed to load highlights:', err);
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const addHighlight = useCallback(
    async (location: ReadingLocation, textContent: string, color: string = '#FACC15') => {
      if (!documentId) return null;
      try {
        const created = await highlightsService.createHighlight(
          documentId,
          location,
          textContent,
          color
        );
        setHighlights((prev) => [...prev, created]);
        return created;
      } catch (err) {
        console.error('Failed to create highlight:', err);
        return null;
      }
    },
    [documentId]
  );

  const removeHighlight = useCallback(
    async (highlightId: string) => {
      if (!documentId) return;
      try {
        await highlightsService.deleteHighlight(documentId, highlightId);
        setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
      } catch (err) {
        console.error('Failed to delete highlight:', err);
      }
    },
    [documentId]
  );

  return {
    highlights,
    isLoading,
    addHighlight,
    removeHighlight,
    refreshHighlights: fetchHighlights,
  };
}
