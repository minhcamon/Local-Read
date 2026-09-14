import { apiClient } from './apiClient.js';
import type { Highlight, ReadingLocation } from '../types/index.js';

export const highlightsService = {
  async getHighlights(documentId: string): Promise<Highlight[]> {
    const res = await apiClient.get<{ data: Highlight[] }>(`/highlights/${documentId}`);
    return res.data.data;
  },

  async createHighlight(
    documentId: string,
    location: ReadingLocation,
    textContent: string,
    color: string = '#FACC15'
  ): Promise<Highlight> {
    const res = await apiClient.post<{ data: Highlight }>(`/highlights/${documentId}`, {
      location,
      textContent,
      color,
    });
    return res.data.data;
  },

  async deleteHighlight(documentId: string, highlightId: string): Promise<void> {
    await apiClient.delete(`/highlights/${documentId}/${highlightId}`);
  },
};
