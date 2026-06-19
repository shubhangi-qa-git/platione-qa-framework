import { Page, expect } from '@playwright/test';
import { env } from '../config/env';
import { Logger } from '../utils/logger';

/**
 * Base page object.
 *
 * Common navigation/wait/assert plumbing shared by every page. Concrete pages
 * extend this and only declare their own locators and domain actions, which
 * keeps page objects small and consistent.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Path relative to BASE_URL, e.g. '/contacts'. */
  protected abstract readonly path: string;

  async goto(): Promise<void> {
    const url = `${env.baseUrl}${this.path}`;
    Logger.info('Navigating', { url });
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async expectVisible(testId: string): Promise<void> {
    await expect(this.page.getByTestId(testId)).toBeVisible();
  }

  async clickByTestId(testId: string): Promise<void> {
    await this.page.getByTestId(testId).click();
  }

  async fillByTestId(testId: string, value: string): Promise<void> {
    await this.page.getByTestId(testId).fill(value);
  }
}
