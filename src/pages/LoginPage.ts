import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../config/env';
import { Logger } from '../utils/logger';

/**
 * Login page object.
 *
 * Encapsulates the login form. Locators use data-testid so tests are decoupled
 * from copy/styling changes. `login()` defaults to env credentials so most
 * tests call it with no arguments.
 */
export class LoginPage extends BasePage {
  protected readonly path = '/login';

  private readonly email = () => this.page.getByTestId('login-email');
  private readonly password = () => this.page.getByTestId('login-password');
  private readonly submit = () => this.page.getByTestId('login-submit');
  private readonly error = () => this.page.getByTestId('login-error');

  constructor(page: Page) {
    super(page);
  }

  async login(username = env.username, secret = env.password): Promise<void> {
    Logger.info('UI login', { username });
    await this.email().fill(username);
    await this.password().fill(secret);
    await this.submit().click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectLoginError(): Promise<void> {
    await expect(this.error()).toBeVisible();
  }
}
