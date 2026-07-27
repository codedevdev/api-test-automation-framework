import { test as base } from '@playwright/test';
import { AuthorsApi } from '../apis/fake-rest-api/authors.api';
import { BooksApi } from '../apis/fake-rest-api/books.api';
import { ApiClient } from '../clients/api-client';
import { AuthorFactory } from '../factories/author.factory';
import { BookFactory } from '../factories/book.factory';

type FakeApiFixtures = {
  apiClient: ApiClient;
  booksApi: BooksApi;
  authorsApi: AuthorsApi;
  bookFactory: typeof BookFactory;
  authorFactory: typeof AuthorFactory;
};

export const test = base.extend<FakeApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  booksApi: async ({ apiClient }, use) => {
    await use(new BooksApi(apiClient));
  },

  authorsApi: async ({ apiClient }, use) => {
    await use(new AuthorsApi(apiClient));
  },

  bookFactory: async ({}, use): Promise<void> => {
    await use(BookFactory);
  },

  authorFactory: async ({}, use): Promise<void> => {
    await use(AuthorFactory);
  },
});

export { expect } from '@playwright/test';
