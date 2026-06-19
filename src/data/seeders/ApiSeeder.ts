import { ContactApiClient } from '../../api/clients/ContactApiClient';
import { ActionApiClient } from '../../api/clients/ActionApiClient';
import { InteractionApiClient } from '../../api/clients/InteractionApiClient';
import { AuthHelper } from '../../utils/AuthHelper';
import { ContactFactory } from '../factories/ContactFactory';
import { FollowUpFactory } from '../factories/FollowUpFactory';
import { Contact, FollowUpScenario } from '../../types/models';
import { Logger } from '../../utils/logger';

/**
 * API-based seeder.
 *
 * Seeds data the way a real user would — through the public API — so the data
 * is always valid against current backend rules. It tracks every id it creates
 * and `cleanup()` deletes them, so tests leave no residue (critical once 500
 * tests share an environment).
 *
 * Preferred seeding path for most tests; use the DB seeder only for bulk or
 * states the API can't express.
 */
export class ApiSeeder {
  private readonly contacts = new ContactApiClient();
  private readonly actions = new ActionApiClient();
  private readonly interactions = new InteractionApiClient();
  private readonly createdContactIds: string[] = [];

  /** Authenticate all underlying clients once. */
  async init(): Promise<void> {
    await AuthHelper.authenticate(this.contacts, this.actions, this.interactions);
  }

  async seedContact(overrides: Partial<Contact> = {}): Promise<Contact> {
    const res = await this.contacts.createContact(ContactFactory.create(overrides));
    const created = res.body;
    if (created.id) this.createdContactIds.push(created.id);
    Logger.info('Seeded contact', { id: created.id });
    return created;
  }

  /** Seed a full follow-up graph: contact + interaction + planned action. */
  async seedFollowUp(scenario: FollowUpScenario = FollowUpFactory.create()): Promise<FollowUpScenario> {
    const contact = (await this.contacts.createContact(scenario.contact)).body;
    if (contact.id) this.createdContactIds.push(contact.id);
    await this.interactions.createInteraction({ ...scenario.interaction, contactId: contact.id! });
    await this.actions.createAction({ ...scenario.action, contactId: contact.id! });
    Logger.info('Seeded follow-up scenario', { contactId: contact.id });
    return { ...scenario, contact };
  }

  /** Delete everything this seeder created. Call in afterEach/afterAll. */
  async cleanup(): Promise<void> {
    for (const id of this.createdContactIds.splice(0)) {
      await this.contacts.deleteContact(id);
    }
    Logger.info('ApiSeeder cleanup complete');
  }
}
