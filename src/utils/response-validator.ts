import { expect } from '@playwright/test';
import type { ApiResponse } from '../clients/api-client';

export class ResponseValidator {
  static assertStatus(response: ApiResponse, expected: number | number[]): void {
    const allowed = Array.isArray(expected) ? expected : [expected];
    expect(allowed, `Unexpected status ${response.status}`).toContain(response.status);
  }

  static assertJsonContentType(response: ApiResponse): void {
    const contentType = response.headers['content-type'] ?? '';
    expect(contentType.toLowerCase()).toContain('application/json');
  }

  static assertResponseTime(response: ApiResponse, maxMs: number): void {
    expect(response.durationMs, `Response took ${response.durationMs}ms`).toBeLessThanOrEqual(
      maxMs,
    );
  }

  static assertHeaderDefined(response: ApiResponse, headerName: string): void {
    const value = response.headers[headerName.toLowerCase()];
    expect(value, `Missing header: ${headerName}`).toBeTruthy();
  }
}
