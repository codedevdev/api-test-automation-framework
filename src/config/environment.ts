import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface EnvironmentConfig {
  bookerBaseUrl: string;
  bookerUsername: string;
  bookerPassword: string;
  fakeApiBaseUrl: string;
  apiTimeout: number;
  logLevel: LogLevel;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function parseLogLevel(value: string): LogLevel {
  const allowed: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  if (!allowed.includes(value as LogLevel)) {
    throw new Error(`Invalid LOG_LEVEL "${value}". Expected one of: ${allowed.join(', ')}`);
  }
  return value as LogLevel;
}

export function loadEnvironment(): EnvironmentConfig {
  const timeoutRaw = process.env.API_TIMEOUT ?? '15000';
  const apiTimeout = Number(timeoutRaw);

  if (Number.isNaN(apiTimeout) || apiTimeout <= 0) {
    throw new Error(`Invalid API_TIMEOUT "${timeoutRaw}". Expected a positive number.`);
  }

  return {
    bookerBaseUrl: requireEnv('BOOKER_BASE_URL'),
    bookerUsername: requireEnv('BOOKER_USERNAME'),
    bookerPassword: requireEnv('BOOKER_PASSWORD'),
    fakeApiBaseUrl: requireEnv('FAKE_API_BASE_URL'),
    apiTimeout,
    logLevel: parseLogLevel(process.env.LOG_LEVEL ?? 'info'),
  };
}

let cached: EnvironmentConfig | undefined;

export function getEnvironment(): EnvironmentConfig {
  if (!cached) {
    cached = loadEnvironment();
  }
  return cached;
}
