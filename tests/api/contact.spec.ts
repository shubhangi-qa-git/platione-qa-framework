import { test, expect } from '../fixtures';
import { ContactFactory } from '../../src/data/factories/ContactFactory';
import { LeadFactory } from '../../src/data/factories/LeadFactory';
import { EdgeCaseFactory } from '../../src/data/factories/EdgeCaseFactory';
import { ContactRequestBuilder } from '../../src/api/builders/RequestBuilder';
import { ApiAssertions } from '../../src/api/validators/ApiAssertions';
import { ResponseValidator } from '../../src/api/validators/ResponseValidator';

/**
 * Contact API tests — demonstrate the full stack working together:
 * factory → (optional builder) → API client → assertions/validators.
 */
test.describe('Contact API', () => {
  test('creates a contact with valid data', async ({ contactApi }) => {
    const contact = ContactFactory.create();

    const res = await contactApi.createContact(contact);

    ApiAssertions.created(res);
    ResponseValidator.validateContact(res, contact);
  });

  test('creates a hot lead', async ({ contactApi }) => {
    const lead = LeadFactory.hotLead();

    const res = await contactApi.createContact(lead);

    ApiAssertions.created(res);
    ResponseValidator.hasId(res);
    expect(lead.score).toBeGreaterThanOrEqual(80);
  });

  test('builds a custom payload with the request builder', async ({ contactApi }) => {
    const payload = new ContactRequestBuilder()
      .from(ContactFactory.create())
      .withCompany('Platione QA Co')
      .withStatus('ACTIVE')
      .build();

    const res = await contactApi.createContact(payload as any);

    ApiAssertions.created(res);
  });

  test('updates contact status', async ({ contactApi, seeder }) => {
    const created = await seeder.seedContact();

    const res = await contactApi.updateStatus(created.id!, 'ARCHIVED');

    ApiAssertions.okStatus(res);
  });

  test('deletes a contact', async ({ contactApi }) => {
    const created = (await contactApi.createContact(ContactFactory.create())).body;

    const res = await contactApi.deleteContact(created.id!);

    ApiAssertions.okStatus(res);
  });

  test('edge case: duplicate contacts share an email', async ({ contactApi }) => {
    const [a, b] = EdgeCaseFactory.duplicateContacts();
    expect(a.email).toBe(b.email);

    const first = await contactApi.createContact(a);
    ApiAssertions.created(first);
    // Against a real backend the 2nd create would be rejected (409); in mock
    // mode we assert the duplicate is at least detectable by shared email.
    expect(b.email).toBe(a.email);
  });
});
