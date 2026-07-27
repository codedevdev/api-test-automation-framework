import { expect, test } from '../../../src/fixtures/fake-rest-api.fixture';
import { testConfig } from '../../../src/config/test-config';
import type { Book } from '../../../src/types/book.types';
import { ResponseValidator } from '../../../src/utils/response-validator';

test.describe('Fake REST API smoke @smoke', () => {
  test('GET books returns a non-empty list', async ({ booksApi }) => {
    const response = await booksApi.getBooks();

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET book by id returns a book', async ({ booksApi }) => {
    const response = await booksApi.getBook(1);

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    const body = response.body as Book;
    expect(body.id).toBe(1);
    expect(body.title).toBeTruthy();
  });

  test('POST book returns simulated create response', async ({ booksApi, bookFactory }) => {
    const payload = bookFactory.create();
    const response = await booksApi.createBook(payload);

    ResponseValidator.assertStatus(response, 200);
    const body = response.body as Book;
    expect(body.id).toBe(payload.id);
    expect(body.title).toBe(payload.title);
  });

  test('basic response-time validation for books list', async ({ booksApi }) => {
    const response = await booksApi.getBooks();
    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertResponseTime(response, testConfig.smokeResponseTimeMs);
  });
});
