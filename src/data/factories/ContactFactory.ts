import { faker } from '@faker-js/faker';
import { Contact } from '../../types/models';

/**
 * Contact factory.
 *
 * `create()` returns a complete, realistic Contact. Every field is overridable
 * so a test can pin exactly what it cares about and let faker randomise the
 * rest — this keeps tests independent (unique emails/phones per run) while
 * staying readable.
 */
export class ContactFactory {
  static create(overrides: Partial<Contact> = {}): Contact {
    const firstName = overrides.firstName ?? faker.person.firstName();
    const lastName = overrides.lastName ?? faker.person.lastName();
    return {
      firstName,
      lastName,
      // Derive a unique, deterministic-looking email from the name + a nonce.
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number(),
      company: faker.company.name(),
      jobTitle: faker.person.jobTitle(),
      status: 'ACTIVE',
      tags: [],
      ...overrides,
    };
  }

  /** Build N distinct contacts (unique emails) for list/pagination tests. */
  static createMany(count: number, overrides: Partial<Contact> = {}): Contact[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
