import type { ApiClient, ApiResponse } from '../../clients/api-client';
import type { AuthCredentials, AuthErrorResponse, AuthResponse } from '../../types/auth.types';

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  async createToken(
    credentials: AuthCredentials,
  ): Promise<ApiResponse<AuthResponse | AuthErrorResponse>> {
    return this.client.post<AuthResponse | AuthErrorResponse>('/auth', {
      data: credentials,
    });
  }
}
