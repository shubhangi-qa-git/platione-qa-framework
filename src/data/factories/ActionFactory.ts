import { faker } from '@faker-js/faker';
import { PlannedAction } from '../../types/models';

/**
 * Planned-action factory.
 *
 * Actions always belong to a contact, so `contactId` is required. Named
 * builders express the two states the app cares about most: an upcoming
 * planned action and one that's overdue (drives the follow-up reminders).
 */
export class ActionFactory {
  static create(contactId: string, overrides: Partial<PlannedAction> = {}): PlannedAction {
    return {
      contactId,
      type: faker.helpers.arrayElement(['CALL', 'EMAIL', 'MEETING', 'DEMO', 'FOLLOW_UP']),
      status: 'PLANNED',
      title: faker.helpers.arrayElement(['Intro call', 'Send proposal', 'Product demo', 'Quarterly check-in']),
      notes: faker.lorem.sentence(),
      dueDate: faker.date.soon({ days: 7 }).toISOString(),
      ...overrides,
    };
  }

  /** Planned action whose due date is in the past — should surface as overdue. */
  static overdue(contactId: string, overrides: Partial<PlannedAction> = {}): PlannedAction {
    return this.create(contactId, {
      status: 'PLANNED',
      dueDate: faker.date.recent({ days: 10 }).toISOString(),
      ...overrides,
    });
  }

  static completed(contactId: string, overrides: Partial<PlannedAction> = {}): PlannedAction {
    return this.create(contactId, { status: 'COMPLETED', ...overrides });
  }
}
