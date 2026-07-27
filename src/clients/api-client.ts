import type { APIRequestContext, APIResponse } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { getEnvironment } from '../config/environment';
import { logger } from '../utils/logger';
import { sanitizeHeaders, sanitizeObject, sanitizeText } from '../utils/secret-sanitizer';

export interface RequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body: T;
  rawBody: string;
  durationMs: number;
  correlationId: string;
  url: string;
  method: string;
}

function toHeaderMap(response: APIResponse): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(response.headers())) {
    result[key.toLowerCase()] = value;
  }
  return result;
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  if (!params) {
    return path;
  }

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      search.append(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

async function parseBody<T>(response: APIResponse): Promise<{ body: T; rawBody: string }> {
  const rawBody = await response.text();
  if (!rawBody) {
    return { body: undefined as T, rawBody: '' };
  }

  try {
    return { body: JSON.parse(rawBody) as T, rawBody };
  } catch {
    return { body: rawBody as T, rawBody };
  }
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.send<T>('GET', path, options);
  }

  async post<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.send<T>('POST', path, options);
  }

  async put<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.send<T>('PUT', path, options);
  }

  async patch<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.send<T>('PATCH', path, options);
  }

  async delete<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.send<T>('DELETE', path, options);
  }

  private async send<T>(
    method: string,
    path: string,
    options: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const correlationId = randomUUID();
    const url = buildUrl(path, options.params);
    const timeout = getEnvironment().apiTimeout;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Correlation-Id': correlationId,
      ...options.headers,
    };

    const started = Date.now();
    logger.info(`${method} ${url}`, {
      correlationId,
      headers: sanitizeHeaders(headers),
      data: options.data ? sanitizeObject(options.data as Record<string, unknown>) : undefined,
    });

    const response = await this.request.fetch(url, {
      method,
      headers,
      data: options.data,
      timeout,
      failOnStatusCode: false,
    });

    const durationMs = Date.now() - started;
    const headerMap = toHeaderMap(response);
    const { body, rawBody } = await parseBody<T>(response);

    const apiResponse: ApiResponse<T> = {
      status: response.status(),
      headers: headerMap,
      body,
      rawBody,
      durationMs,
      correlationId,
      url,
      method,
    };

    const logPayload = {
      correlationId,
      status: apiResponse.status,
      durationMs,
    };

    if (apiResponse.status >= 400) {
      logger.error(`${method} ${url} failed`, {
        ...logPayload,
        body: sanitizeText(rawBody),
      });
    } else {
      logger.info(`${method} ${url} completed`, logPayload);
      logger.debug(`${method} ${url} body`, sanitizeText(rawBody));
    }

    return apiResponse;
  }
}
