import { expect, test } from '../../../src/fixtures/fake-rest-api.fixture';
import type { Author } from '../../../src/types/author.types';
import type { Book } from '../../../src/types/book.types';
import { ResponseValidator } from '../../../src/utils/response-validator';

test.describe('Fake REST API regression @regression', () => {
  test('PUT book returns updated payload echo', async ({ booksApi, bookFactory }) => {
    const payload = bookFactory.create({ id: 55, title: 'Updated Title', pageCount: 410 });
    const response = await booksApi.updateBook(55, payload);

    ResponseValidator.assertStatus(response, 200);
    const body = response.body as Book;
    expect(body.id).toBe(55);
    expect(body.title).toBe('Updated Title');
    expect(body.pageCount).toBe(410);
  });

  test('DELETE book returns success status', async ({ booksApi }) => {
    const response = await booksApi.deleteBook(55);
    ResponseValidator.assertStatus(response, 200);
  });

  test('GET authors returns a list', async ({ authorsApi }) => {
    const response = await authorsApi.getAuthors();
    ResponseValidator.assertStatus(response, 200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET author by id', async ({ authorsApi }) => {
    const response = await authorsApi.getAuthor(1);
    ResponseValidator.assertStatus(response, 200);
    const body = response.body as Author;
    expect(body.id).toBe(1);
    expect(body.firstName).toBeTruthy();
  });

  test('GET authors by book id', async ({ authorsApi }) => {
    const response = await authorsApi.getAuthorsByBook(1);
    ResponseValidator.assertStatus(response, 200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('POST author returns simulated create response', async ({ authorsApi, authorFactory }) => {
    const payload = authorFactory.create({ id: 8801, idBook: 12 });
    const response = await authorsApi.createAuthor(payload);

    ResponseValidator.assertStatus(response, 200);
    const body = response.body as Author;
    expect(body.id).toBe(8801);
    expect(body.idBook).toBe(12);
  });

  test('book with high page count', async ({ booksApi, bookFactory }) => {
    const payload = bookFactory.create({ pageCount: 5000 });
    const response = await booksApi.createBook(payload);
    ResponseValidator.assertStatus(response, 200);
    expect((response.body as Book).pageCount).toBe(5000);
  });

  test('book with special characters in title', async ({ booksApi, bookFactory }) => {
    const payload = bookFactory.create({ title: 'C++ & "Rust" notes / 日本語' });
    const response = await booksApi.createBook(payload);
    ResponseValidator.assertStatus(response, 200);
    expect((response.body as Book).title).toBe(payload.title);
  });
});
