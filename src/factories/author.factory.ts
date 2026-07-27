import { faker } from '@faker-js/faker';
import type { Author } from '../types/author.types';

export class AuthorFactory {
  static create(overrides: Partial<Author> = {}): Author {
    return {
      id: faker.number.int({ min: 1000, max: 99999 }),
      idBook: faker.number.int({ min: 1, max: 200 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      ...overrides,
    };
  }
}
