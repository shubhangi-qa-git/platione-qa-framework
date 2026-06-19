import { AuthApiClient } from '../api/clients/AuthApiClient';
import { BaseApiClient } from '../api/clients/BaseApiClient';
import { env } from '../config/env';
import { Logger } from './logger';

/**
 * Authentication helper.
 *
 * One place that knows how to obtain a token and inject it into API clients,
 * so individual tests never re-implement login. Caches the token per process
 * to avoid a login round-trip on every test.
 */
export class AuthHelper {
  private static cachedToken?: string;

  static async getToken(force = false): Promise<string> {
    if (this.cachedToken && !force) return this.cachedToken;
    const auth = new AuthApiClient();
    const res = await auth.login(env.username, env.password);
    this.cachedToken = res.body.token;
    Logger.info('Authenticated', { user: env.username });
    return this.cachedToken;
  }

  /** Authenticate the given clients with a shared token. */
  static async authenticate(...clients: BaseApiClient[]): Promise<void> {
    const token = await this.getToken();
    for (const client of clients) {
      client.setToken(token);
      await client.init();
    }
  }
}
