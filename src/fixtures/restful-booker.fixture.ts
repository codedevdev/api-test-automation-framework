import { test as base } from '@playwright/test';
import { AuthApi } from '../apis/restful-booker/auth.api';
import { BookingApi } from '../apis/restful-booker/booking.api';
import { ApiClient } from '../clients/api-client';
import { getEnvironment } from '../config/environment';
import { BookingFactory } from '../factories/booking.factory';
import type { AuthResponse } from '../types/auth.types';

type BookerFixtures = {
  apiClient: ApiClient;
  authApi: AuthApi;
  bookingApi: BookingApi;
  authToken: string;
  bookingFactory: typeof BookingFactory;
};

export const test = base.extend<BookerFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  authApi: async ({ apiClient }, use) => {
    await use(new AuthApi(apiClient));
  },

  bookingApi: async ({ apiClient }, use) => {
    await use(new BookingApi(apiClient));
  },

  authToken: async ({ authApi }, use) => {
    const env = getEnvironment();
    const response = await authApi.createToken({
      username: env.bookerUsername,
      password: env.bookerPassword,
    });

    if (response.status !== 200 || !response.body || typeof response.body !== 'object') {
      throw new Error(`Unable to create auth token. Status: ${response.status}`);
    }

    const body = response.body as AuthResponse;
    if (!('token' in body) || !body.token) {
      throw new Error(`Auth response did not include a token: ${response.rawBody}`);
    }

    await use(body.token);
  },

  bookingFactory: async ({}, use): Promise<void> => {
    await use(BookingFactory);
  },
});

export { expect } from '@playwright/test';
