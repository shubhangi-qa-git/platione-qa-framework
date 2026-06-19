import { test as base } from '@playwright/test';
import { ApiSeeder } from '../src/data/seeders/ApiSeeder';
import { ContactApiClient } from '../src/api/clients/ContactApiClient';
import { ActionApiClient } from '../src/api/clients/ActionApiClient';
import { InteractionApiClient } from '../src/api/clients/InteractionApiClient';
import { AuthHelper } from '../src/utils/AuthHelper';

/**
 * Custom Playwright fixtures.
 *
 * Extends the base `test` so every spec receives ready-to-use, authenticated
 * clients and a seeder — with automatic cleanup after each test. This is the
 * single seam tests depend on, so wiring changes never touch the specs.
 */
type Fixtures = {
  seeder: ApiSeeder;
  contactApi: ContactApiClient;
  actionApi: ActionApiClient;
  interactionApi: InteractionApiClient;
};

export const test = base.extend<Fixtures>({
  seeder: async ({}, use) => {
    const seeder = new ApiSeeder();
    await seeder.init();
    await use(seeder);
    await seeder.cleanup(); // teardown: remove everything this test created
  },

  contactApi: async ({}, use) => {
    const client = new ContactApiClient();
    await AuthHelper.authenticate(client);
    await use(client);
  },

  actionApi: async ({}, use) => {
    const client = new ActionApiClient();
    await AuthHelper.authenticate(client);
    await use(client);
  },

  interactionApi: async ({}, use) => {
    const client = new InteractionApiClient();
    await AuthHelper.authenticate(client);
    await use(client);
  },
});

export { expect } from '@playwright/test';
