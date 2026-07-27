const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'cookie', 'username'];

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEYS.some((item) => lower.includes(item));
}

function sanitizeValue(key: string, value: unknown): unknown {
  if (isSensitiveKey(key)) {
    return '[REDACTED]';
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeValue(String(index), item));
  }

  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>);
  }

  return value;
}

export function sanitizeObject(payload: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    result[key] = sanitizeValue(key, value);
  }
  return result;
}

export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    result[key] = isSensitiveKey(key) ? '[REDACTED]' : value;
  }
  return result;
}

export function sanitizeText(text: string): string {
  return text
    .replace(/token=[^;\s]+/gi, 'token=[REDACTED]')
    .replace(/"password"\s*:\s*"[^"]*"/gi, '"password":"[REDACTED]"')
    .replace(/"token"\s*:\s*"[^"]*"/gi, '"token":"[REDACTED]"')
    .replace(/"username"\s*:\s*"[^"]*"/gi, '"username":"[REDACTED]"');
}
