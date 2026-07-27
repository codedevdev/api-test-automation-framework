import type { ApiClient, ApiResponse } from '../../clients/api-client';
import type { Author } from '../../types/author.types';

export class AuthorsApi {
  constructor(private readonly client: ApiClient) {}

  async getAuthors(): Promise<ApiResponse<Author[]>> {
    return this.client.get<Author[]>('/api/v1/Authors');
  }

  async getAuthor(id: number | string): Promise<ApiResponse<Author | unknown>> {
    return this.client.get<Author | unknown>(`/api/v1/Authors/${id}`);
  }

  async getAuthorsByBook(idBook: number): Promise<ApiResponse<Author[]>> {
    return this.client.get<Author[]>(`/api/v1/Authors/authors/books/${idBook}`);
  }

  async createAuthor(author: Author): Promise<ApiResponse<Author | unknown>> {
    return this.client.post<Author | unknown>('/api/v1/Authors', {
      data: author,
    });
  }

  async updateAuthor(id: number, author: Author): Promise<ApiResponse<Author | unknown>> {
    return this.client.put<Author | unknown>(`/api/v1/Authors/${id}`, {
      data: author,
    });
  }

  async deleteAuthor(id: number): Promise<ApiResponse<unknown>> {
    return this.client.delete(`/api/v1/Authors/${id}`);
  }
}
