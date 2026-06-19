import { faker } from '@faker-js/faker';
import { Lead } from '../../types/models';
import { ContactFactory } from './ContactFactory';

/**
 * Lead factory.
 *
 * A Lead is a Contact with sales-qualification fields. Named builders
 * (`hotLead`, `coldLead`) encode the business meaning of a lead temperature
 * (score band + stage) so tests read in domain terms, not magic numbers.
 */
export class LeadFactory {
  static create(overrides: Partial<Lead> = {}): Lead {
    return {
      ...ContactFactory.create(),
      leadType: 'WARM',
      stage: 'NEW',
      score: faker.number.int({ min: 40, max: 70 }),
      estimatedValue: faker.number.int({ min: 1000, max: 50000 }),
      source: faker.helpers.arrayElement(['WEBSITE', 'REFERRAL', 'EVENT', 'COLD_CALL']),
      ...overrides,
    };
  }

  /** High-intent lead: high score, advanced stage. */
  static hotLead(overrides: Partial<Lead> = {}): Lead {
    return this.create({
      leadType: 'HOT',
      stage: 'QUALIFIED',
      score: faker.number.int({ min: 80, max: 100 }),
      ...overrides,
    });
  }

  /** Low-intent lead: low score, still new. */
  static coldLead(overrides: Partial<Lead> = {}): Lead {
    return this.create({
      leadType: 'COLD',
      stage: 'NEW',
      score: faker.number.int({ min: 0, max: 25 }),
      ...overrides,
    });
  }
}
