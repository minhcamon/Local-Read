import { apiClient } from './apiClient.js';
import type { ReadingProgress, ReadingLocation } from '../types/index.js';

export const progressService = {
  async getProgress(documentId: string): Promise<ReadingProgress | null> {
    const res = await apiClient.get<{ data: ReadingProgress | null }>(`/progress/${documentId}`);
    return res.data.data;
  },

  async saveProgress(
    documentId: string,
    location: ReadingLocation,
    percentage?: number
  ): Promise<ReadingProgress> {
    const res = await apiClient.put<{ data: ReadingProgress }>(`/progress/${documentId}`, {
      location,
      percentage,
    });
    return res.data.data;
  },
};
