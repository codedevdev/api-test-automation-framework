import type { ApiClient, ApiResponse } from '../../clients/api-client';
import type { Book } from '../../types/book.types';

export class BooksApi {
  constructor(private readonly client: ApiClient) {}

  async getBooks(): Promise<ApiResponse<Book[]>> {
    return this.client.get<Book[]>('/api/v1/Books');
  }

  async getBook(id: number | string): Promise<ApiResponse<Book | unknown>> {
    return this.client.get<Book | unknown>(`/api/v1/Books/${id}`);
  }

  async createBook(book: Book): Promise<ApiResponse<Book | unknown>> {
    return this.client.post<Book | unknown>('/api/v1/Books', {
      data: book,
    });
  }

  async updateBook(id: number | string, book: Book): Promise<ApiResponse<Book | unknown>> {
    return this.client.put<Book | unknown>(`/api/v1/Books/${id}`, {
      data: book,
    });
  }

  async deleteBook(id: number | string): Promise<ApiResponse<unknown>> {
    return this.client.delete(`/api/v1/Books/${id}`);
  }
}
