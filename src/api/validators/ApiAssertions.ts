import { expect } from '@playwright/test';
import { ApiResponse } from '../clients/BaseApiClient';

/**
 * Generic, reusable status-level assertions for API responses.
 * Business-shape checks live in ResponseValidator.
 */
export class ApiAssertions {
  /** Any 2xx. */
  static ok(response: ApiResponse): void {
    expect(
      response.status,
      `Expected a 2xx status but got ${response.status}`,
    ).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
  }

  static created(response: ApiResponse): void {
    expect(response.status, 'Expected 201 Created').toBe(201);
  }

  static okStatus(response: ApiResponse): void {
    expect(response.status, 'Expected 200 OK').toBe(200);
  }

  static status(response: ApiResponse, code: number): void {
    expect(response.status).toBe(code);
  }

  static badRequest(response: ApiResponse): void {
    expect(response.status, 'Expected 400 Bad Request').toBe(400);
  }
}
