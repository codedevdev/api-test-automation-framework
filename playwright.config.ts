import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const isCi = !!process.env.CI;
const timeout = Number(process.env.API_TIMEOUT ?? 15000);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          framework: 'Playwright API',
          node_version: process.version,
          os: process.platform,
        },
      },
    ],
  ],
  use: {
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'restful-booker',
      testDir: './tests/restful-booker',
      timeout,
      use: {
        baseURL: process.env.BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com',
      },
    },
    {
      name: 'fake-rest-api',
      testDir: './tests/fake-rest-api',
      timeout,
      use: {
        baseURL: process.env.FAKE_API_BASE_URL ?? 'https://fakerestapi.azurewebsites.net',
      },
    },
  ],
});
