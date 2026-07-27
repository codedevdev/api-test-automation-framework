import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  coerceTypes: false,
});
addFormats(ajv);

const cache = new Map<string, ValidateFunction>();

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) {
    return 'Unknown schema validation error';
  }

  return errors
    .map((error) => {
      const path = error.instancePath || '/';
      const details = error.params ? ` (${JSON.stringify(error.params)})` : '';
      return `${path}: ${error.message ?? 'invalid'}${details}`;
    })
    .join('; ');
}

export class SchemaValidator {
  static loadSchema(relativePath: string): object {
    const absolutePath = resolve(process.cwd(), relativePath);
    const raw = readFileSync(absolutePath, 'utf-8');
    return JSON.parse(raw) as object;
  }

  static compile(schema: object, cacheKey: string): ValidateFunction {
    const existing = cache.get(cacheKey);
    if (existing) {
      return existing;
    }

    const validate = ajv.compile(schema);
    cache.set(cacheKey, validate);
    return validate;
  }

  static validate(schemaPath: string, data: unknown): void {
    const schema = this.loadSchema(schemaPath);
    const validate = this.compile(schema, schemaPath);
    const valid = validate(data);

    if (!valid) {
      throw new Error(
        `JSON Schema validation failed for ${schemaPath}: ${formatErrors(validate.errors)}`,
      );
    }
  }
}
