import { Page } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * NavBar component object.
 *
 * Component objects model a piece of UI that appears across many pages (here,
 * the global side-nav). Pages compose components instead of duplicating their
 * locators, so a nav change is fixed in exactly one file.
 */
export class NavBar {
  constructor(private readonly page: Page) {}

  private readonly link = (section: string) => this.page.getByTestId(`nav-${section}`);

  async goToContacts(): Promise<void> {
    Logger.info('Nav → Contacts');
    await this.link('contacts').click();
  }

  async goToActions(): Promise<void> {
    Logger.info('Nav → Actions');
    await this.link('actions').click();
  }

  async logout(): Promise<void> {
    await this.link('logout').click();
  }
}
