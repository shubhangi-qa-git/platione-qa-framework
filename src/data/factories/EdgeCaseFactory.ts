import { Contact } from '../../types/models';
import { ContactFactory } from './ContactFactory';

/**
 * Edge-case factory.
 *
 * Centralises the "nasty" inputs every CRUD surface should be tested against —
 * duplicates, validation failures, boundary lengths, injection and unicode.
 * Returning them from one place means new tests get edge coverage for free and
 * the definition of "edge case" lives in one reviewable spot.
 */
export class EdgeCaseFactory {
  /** Two contacts sharing an email — for duplicate-detection tests. */
  static duplicateContacts(email = 'duplicate@plati-one.com'): [Contact, Contact] {
    return [ContactFactory.create({ email }), ContactFactory.create({ email })];
  }

  static invalidEmail(): Contact {
    return ContactFactory.create({ email: 'not-an-email' });
  }

  /** Missing required first/last name — should be rejected by validation. */
  static missingRequiredFields(): Partial<Contact> {
    const { firstName, lastName, ...rest } = ContactFactory.create();
    return rest;
  }

  /** Maximum-length names to probe column/field limits. */
  static boundaryLengths(): Contact {
    return ContactFactory.create({
      firstName: 'A'.repeat(255),
      lastName: 'B'.repeat(255),
    });
  }

  /** SQL-injection-style payload — must be safely escaped, not executed. */
  static sqlInjection(): Contact {
    return ContactFactory.create({ firstName: "Robert'); DROP TABLE contacts;--" });
  }

  /** Unicode / emoji to verify UTF-8 handling end to end. */
  static unicode(): Contact {
    return ContactFactory.create({ firstName: '测试', lastName: 'Müller-Ñoño 🚀' });
  }

  /** Whitespace-only fields — common trim-validation gap. */
  static whitespaceOnly(): Contact {
    return ContactFactory.create({ firstName: '   ', lastName: '\t\n' });
  }
}
