import { faker } from '@faker-js/faker';
import type { Book } from '../types/book.types';

export class BookFactory {
  static create(overrides: Partial<Book> = {}): Book {
    return {
      id: faker.number.int({ min: 1000, max: 99999 }),
      title: faker.lorem.words({ min: 2, max: 5 }),
      description: faker.lorem.sentence(),
      pageCount: faker.number.int({ min: 50, max: 900 }),
      excerpt: faker.lorem.paragraph(),
      publishDate: faker.date.past().toISOString(),
      ...overrides,
    };
  }

  static createPredictable(): Book {
    return this.create({
      id: 4242,
      title: 'Automation Field Notes',
      description: 'A predictable book payload for contract checks',
      pageCount: 320,
      excerpt: 'Chapter one starts here.',
      publishDate: '2024-01-15T10:00:00.000Z',
    });
  }
}
