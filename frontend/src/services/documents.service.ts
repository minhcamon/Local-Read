import { apiClient } from './apiClient.js';
import type { DocumentSummary } from '../types/index.js';

export const documentsService = {
  async getDocumentById(id: string): Promise<DocumentSummary> {
    const res = await apiClient.get<{ data: DocumentSummary }>(`/documents/${id}`);
    return res.data.data;
  },

  getDocumentFileUrl(id: string): string {
    return `/api/documents/${id}/file`;
  },
};
