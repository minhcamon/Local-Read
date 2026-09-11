import { apiClient } from './apiClient.js';
import type { Book } from '../types/index.js';

export const booksService = {
  async getBooks(): Promise<Book[]> {
    const res = await apiClient.get<{ data: Book[] }>('/books');
    return res.data.data;
  },

  async getBookById(id: string): Promise<Book> {
    const res = await apiClient.get<{ data: Book }>(`/books/${id}`);
    return res.data.data;
  },

  async importBook(file: File, title?: string, author?: string): Promise<Book> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (author) formData.append('author', author);

    const res = await apiClient.post<{ data: Book }>('/books/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
};
