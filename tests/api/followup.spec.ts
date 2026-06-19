import { test, expect } from '../fixtures';
import { FollowUpFactory } from '../../src/data/factories/FollowUpFactory';
import { ApiAssertions } from '../../src/api/validators/ApiAssertions';

/**
 * Follow-up scenario test — seeds a composite contact + interaction + action
 * graph through the API seeder and verifies the action is created.
 */
test.describe('Follow-up scenarios', () => {
  test('seeds a complete follow-up graph', async ({ seeder }) => {
    const scenario = FollowUpFactory.create();

    const result = await seeder.seedFollowUp(scenario);

    expect(result.contact.id).toBeTruthy();
    expect(result.action.type).toBe('FOLLOW_UP');
  });

  test('creates an overdue follow-up action', async ({ actionApi }) => {
    const scenario = FollowUpFactory.overdue();

    const res = await actionApi.createAction(scenario.action);

    ApiAssertions.created(res);
    expect(new Date(scenario.action.dueDate).getTime()).toBeLessThan(Date.now());
  });
});
