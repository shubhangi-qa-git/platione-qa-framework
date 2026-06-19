import { Page, TestInfo } from '@playwright/test';
import { Logger } from './logger';

/**
 * Screenshot capture helper.
 *
 * Produces uniquely-named, timestamped screenshots and attaches them to the
 * Playwright report when a TestInfo is supplied, so failures are debuggable
 * from the HTML report alone.
 */
export class ScreenshotUtil {
  static async capture(page: Page, name: string, testInfo?: TestInfo): Promise<string> {
    const safeName = name.replace(/[^a-z0-9-_]/gi, '_');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = `screenshots/${safeName}-${stamp}.png`;

    const buffer = await page.screenshot({ path: filePath, fullPage: true });
    Logger.info('Screenshot captured', { filePath });

    if (testInfo) {
      await testInfo.attach(safeName, { body: buffer, contentType: 'image/png' });
    }
    return filePath;
  }
}
