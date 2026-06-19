import { faker } from '@faker-js/faker';
import { Interaction } from '../../types/models';

/**
 * Completed-interaction factory.
 *
 * Represents a logged customer touchpoint (call/email/meeting) that has already
 * happened, so `occurredAt` is in the past.
 */
export class InteractionFactory {
  static create(contactId: string, overrides: Partial<Interaction> = {}): Interaction {
    return {
      contactId,
      channel: faker.helpers.arrayElement(['CALL', 'EMAIL', 'MEETING', 'WHATSAPP', 'IN_PERSON']),
      summary: faker.lorem.sentence(),
      occurredAt: faker.date.recent({ days: 30 }).toISOString(),
      durationMinutes: faker.number.int({ min: 5, max: 90 }),
      outcome: faker.helpers.arrayElement(['POSITIVE', 'NEUTRAL', 'NEEDS_FOLLOW_UP', 'NOT_INTERESTED']),
      ...overrides,
    };
  }
}
