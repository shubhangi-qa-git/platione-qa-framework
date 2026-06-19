import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Contact } from '../types/models';
import { Logger } from '../utils/logger';

/**
 * Contacts page object.
 *
 * Domain actions for the contact list/create flow. Methods speak in business
 * terms (createContact, searchContact) and return nothing test-specific, so
 * specs stay readable and resilient to DOM changes.
 */
export class ContactsPage extends BasePage {
  protected readonly path = '/contacts';

  private readonly addButton = () => this.page.getByTestId('contacts-add');
  private readonly firstName = () => this.page.getByTestId('contact-first-name');
  private readonly lastName = () => this.page.getByTestId('contact-last-name');
  private readonly email = () => this.page.getByTestId('contact-email');
  private readonly phone = () => this.page.getByTestId('contact-phone');
  private readonly save = () => this.page.getByTestId('contact-save');
  private readonly search = () => this.page.getByTestId('contacts-search');
  private readonly row = (email: string) => this.page.getByTestId(`contact-row-${email}`);

  constructor(page: Page) {
    super(page);
  }

  async createContact(contact: Contact): Promise<void> {
    Logger.info('UI create contact', { email: contact.email });
    await this.addButton().click();
    await this.firstName().fill(contact.firstName);
    await this.lastName().fill(contact.lastName);
    await this.email().fill(contact.email);
    await this.phone().fill(contact.phone);
    await this.save().click();
  }

  async searchContact(term: string): Promise<void> {
    await this.search().fill(term);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async expectContactVisible(email: string): Promise<void> {
    await expect(this.row(email)).toBeVisible();
  }
}
