import { APIRequestContext, request } from '@playwright/test';
import { env } from '../../config/env';
import { Logger } from '../../utils/logger';

export interface ApiResponse<T = any> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

/**
 * Base API client.
 *
 * Holds shared HTTP plumbing so concrete clients (Contact, Action, ...) only
 * describe endpoints, not transport. Two modes:
 *   - mock  (env.mockApi=true): returns deterministic responses, zero network.
 *           Lets the whole framework run in CI before the backend exists.
 *   - live  (env.mockApi=false): uses Playwright's APIRequestContext with the
 *           bearer token set via `authenticate()`.
 */
export abstract class BaseApiClient {
  protected ctx?: APIRequestContext;
  protected token?: string;

  /** Build a live request context with auth + JSON headers. Skipped in mock mode. */
  async init(): Promise<void> {
    if (env.mockApi) return;
    this.ctx = await request.newContext({
      baseURL: env.apiUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    });
  }

  setToken(token: string): void {
    this.token = token;
  }

  protected async post<T>(pathName: string, data: unknown, mock: ApiResponse<T>): Promise<ApiResponse<T>> {
    return this.send('POST', pathName, data, mock);
  }

  protected async put<T>(pathName: string, data: unknown, mock: ApiResponse<T>): Promise<ApiResponse<T>> {
    return this.send('PUT', pathName, data, mock);
  }

  protected async del<T>(pathName: string, mock: ApiResponse<T>): Promise<ApiResponse<T>> {
    return this.send('DELETE', pathName, undefined, mock);
  }

  private async send<T>(
    method: 'POST' | 'PUT' | 'DELETE',
    pathName: string,
    data: unknown,
    mock: ApiResponse<T>,
  ): Promise<ApiResponse<T>> {
    Logger.info(`API ${method} ${pathName}`, { mock: env.mockApi });

    if (env.mockApi) return mock;

    if (!this.ctx) await this.init();
    const res = await this.ctx!.fetch(pathName, { method, data });
    return {
      status: res.status(),
      body: (await res.json().catch(() => ({}))) as T,
      headers: res.headers(),
    };
  }
}
