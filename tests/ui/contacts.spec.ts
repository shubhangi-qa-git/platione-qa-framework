import { test } from '../fixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { ContactsPage } from '../../src/pages/ContactsPage';
import { NavBar } from '../../src/components/NavBar';
import { ContactFactory } from '../../src/data/factories/ContactFactory';
import { ScreenshotUtil } from '../../src/utils/ScreenshotUtil';
import { env } from '../../src/config/env';

/**
 * UI smoke test — demonstrates page objects + component objects + factories
 * composing into a readable flow.
 *
 * Skipped in mock mode (no real UI to drive). Run against a deployed env with
 * MOCK_API=false to exercise it. Left in to show the intended UI structure.
 */
test.describe('Contacts UI', () => {
  test.skip(env.mockApi, 'No live UI available in mock mode');

  test('creates a contact through the UI', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const contactsPage = new ContactsPage(page);
    const nav = new NavBar(page);
    const contact = ContactFactory.create();

    await loginPage.goto();
    await loginPage.login();

    await nav.goToContacts();
    await contactsPage.createContact(contact);
    await contactsPage.searchContact(contact.email);
    await contactsPage.expectContactVisible(contact.email);

    await ScreenshotUtil.capture(page, 'contact-created', testInfo);
  });
});
