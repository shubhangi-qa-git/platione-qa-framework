import { BaseApiClient, ApiResponse } from './BaseApiClient';
import { env } from '../../config/env';

export interface AuthResult {
  token: string;
  userId: string;
}

/**
 * Authentication API client.
 *
 * Exchanges credentials for a bearer token. In mock mode it returns a fake but
 * well-formed token so downstream clients exercise the same code path as live.
 */
export class AuthApiClient extends BaseApiClient {
  async login(
    username = env.username,
    password = env.password,
  ): Promise<ApiResponse<AuthResult>> {
    return this.post<AuthResult>(
      '/auth/login',
      { username, password },
      { status: 200, body: { token: `mock-token-${username}`, userId: 'usr_mock_001' } },
    );
  }
}
