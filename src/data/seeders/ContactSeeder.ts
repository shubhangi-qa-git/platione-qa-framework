import { ApiSeeder } from './ApiSeeder';
import { Contact } from '../../types/models';
import contactsJson from '../seed/contacts.seed.json';

/**
 * Contact seeder facade.
 *
 * Convenience wrapper for the common case — seeding contacts via the API and
 * loading the static JSON baseline. Wraps ApiSeeder so tests get a one-liner
 * (`new ContactSeeder().seedActive()`) without losing automatic cleanup.
 */
export class ContactSeeder {
  private readonly api = new ApiSeeder();

  async init(): Promise<void> {
    await this.api.init();
  }

  async seedActive(): Promise<Contact> {
    return this.api.seedContact({ status: 'ACTIVE' });
  }

  /** Seed the curated baseline contacts from the JSON fixture. */
  async seedFromJson(): Promise<Contact[]> {
    const created: Contact[] = [];
    for (const c of contactsJson as Partial<Contact>[]) {
      created.push(await this.api.seedContact(c));
    }
    return created;
  }

  async cleanup(): Promise<void> {
    await this.api.cleanup();
  }
}
