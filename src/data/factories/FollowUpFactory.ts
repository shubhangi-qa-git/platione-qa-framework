import { FollowUpScenario } from '../../types/models';
import { ContactFactory } from './ContactFactory';
import { ActionFactory } from './ActionFactory';
import { InteractionFactory } from './InteractionFactory';

/**
 * Follow-up scenario factory (composite).
 *
 * A follow-up isn't one entity — it's a *situation*: a contact who had an
 * interaction and now has a planned action. This factory composes the three
 * single-entity factories into one coherent graph (shared contactId), so a
 * test can seed a complete realistic scenario in one call.
 */
export class FollowUpFactory {
  static create(): FollowUpScenario {
    const contact = ContactFactory.create();
    const contactId = contact.id ?? `cnt_${Date.now()}`;
    return {
      contact: { ...contact, id: contactId },
      interaction: InteractionFactory.create(contactId, { outcome: 'NEEDS_FOLLOW_UP' }),
      action: ActionFactory.create(contactId, { type: 'FOLLOW_UP', title: 'Follow up after call' }),
    };
  }

  /** Overdue follow-up: interaction happened, the follow-up action is now past due. */
  static overdue(): FollowUpScenario {
    const scenario = this.create();
    return {
      ...scenario,
      action: ActionFactory.overdue(scenario.contact.id!, {
        type: 'FOLLOW_UP',
        title: 'Overdue follow-up',
      }),
    };
  }
}
