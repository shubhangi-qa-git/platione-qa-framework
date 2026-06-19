import { faker } from '@faker-js/faker';
import { Customer } from '../../types/models';
import { ContactFactory } from './ContactFactory';

/**
 * Customer factory.
 *
 * A converted contact with an account and a contract. `churned()` covers the
 * inactive/expired-renewal path that reporting and re-engagement flows depend on.
 */
export class CustomerFactory {
  static create(overrides: Partial<Customer> = {}): Customer {
    return {
      ...ContactFactory.create(),
      accountId: `acc_${faker.string.alphanumeric(8)}`,
      contractValue: faker.number.int({ min: 5000, max: 250000 }),
      isActive: true,
      renewalDate: faker.date.future().toISOString(),
      ...overrides,
    };
  }

  static churned(overrides: Partial<Customer> = {}): Customer {
    return this.create({
      isActive: false,
      status: 'INACTIVE',
      renewalDate: faker.date.past().toISOString(),
      ...overrides,
    });
  }
}
