import { getEnvironment } from './environment';

export const testConfig = {
  smokeResponseTimeMs: 5000,
  get bookerCredentials() {
    const env = getEnvironment();
    return {
      username: env.bookerUsername,
      password: env.bookerPassword,
    };
  },
} as const;
