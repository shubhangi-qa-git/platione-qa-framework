import { expect } from '@playwright/test';
import { ApiResponse } from '../clients/BaseApiClient';
import { Contact } from '../../types/models';

/**
 * Response-body / schema validators.
 *
 * Asserts the *shape and content* of a payload, complementing ApiAssertions'
 * status-code checks. Keeping field expectations here means a backend contract
 * change is caught in one helper rather than scattered across specs.
 */
export class ResponseValidator {
  static hasId(response: ApiResponse<{ id?: string }>): void {
    expect(response.body, 'Response body missing').toBeTruthy();
    expect(response.body.id, 'Response should include a generated id').toBeTruthy();
  }

  static validateContact(response: ApiResponse<Contact>, expected: Partial<Contact>): void {
    const body = response.body;
    expect(body).toBeTruthy();
    expect(body.id).toBeTruthy();
    if (expected.email) expect(body.email).toBe(expected.email);
    if (expected.firstName) expect(body.firstName).toBe(expected.firstName);
  }

  static fieldEquals<T>(response: ApiResponse<T>, key: keyof T, value: unknown): void {
    expect(response.body[key]).toBe(value);
  }
}
