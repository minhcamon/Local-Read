import { useState, useEffect, useRef, useCallback } from 'react';
import { progressService } from '../../../services/progress.service.js';
import type { ReadingProgress } from '../../../types/index.js';

export function useReadingProgress(documentId: string | null) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);
  const [lastSavedProgress, setLastSavedProgress] = useState<ReadingProgress | null>(null);

  const pendingPageRef = useRef<number>(1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Load initial progress on mount
  useEffect(() => {
    if (!documentId) return;

    let isMounted = true;
    setIsLoadingProgress(true);

    progressService
      .getProgress(documentId)
      .then((progress) => {
        if (isMounted && progress && progress.location?.value?.pageNumber) {
          setCurrentPage(progress.location.value.pageNumber);
          pendingPageRef.current = progress.location.value.pageNumber;
          setLastSavedProgress(progress);
        }
      })
      .catch((err) => {
        console.error('Failed to load reading progress:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProgress(false);
      });

    return () => {
      isMounted = false;
    };
  }, [documentId]);

  // 2. Debounced save function
  const saveProgressToBackend = useCallback(
    async (page: number, total: number) => {
      if (!documentId) return;
      try {
        const result = await progressService.saveProgress(documentId, {
          type: 'pdf_page',
          value: { pageNumber: page, totalPages: total },
        });
        setLastSavedProgress(result);
      } catch (err) {
        console.error('Failed to save reading progress:', err);
      }
    },
    [documentId]
  );

  // 3. Update page with debounce
  const updatePage = useCallback(
    (newPage: number, total?: number) => {
      const activeTotal = total || totalPages;
      if (newPage < 1 || (activeTotal > 0 && newPage > activeTotal)) return;

      setCurrentPage(newPage);
      pendingPageRef.current = newPage;
      if (total) setTotalPages(total);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveProgressToBackend(newPage, activeTotal);
      }, 800); // 800ms debounce per ARCHITECTURE & SKILL
    },
    [totalPages, saveProgressToBackend]
  );

  // 4. Save on unmount if pending
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        saveProgressToBackend(pendingPageRef.current, totalPages);
      }
    };
  }, [saveProgressToBackend, totalPages]);

  return {
    currentPage,
    totalPages,
    setTotalPages,
    updatePage,
    isLoadingProgress,
    lastSavedProgress,
  };
}
