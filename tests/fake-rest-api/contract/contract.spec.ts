import { expect, test } from '../../../src/fixtures/fake-rest-api.fixture';
import type { Author } from '../../../src/types/author.types';
import type { Book } from '../../../src/types/book.types';
import { ResponseValidator } from '../../../src/utils/response-validator';
import { SchemaValidator } from '../../../src/utils/schema-validator';

test.describe('Fake REST API contract @contract', () => {
  test('books list schema and content-type', async ({ booksApi }) => {
    const response = await booksApi.getBooks();

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    ResponseValidator.assertHeaderDefined(response, 'content-type');
    SchemaValidator.validate('src/schemas/fake-rest-api/books.schema.json', response.body);
  });

  test('single book schema', async ({ booksApi }) => {
    const response = await booksApi.getBook(10);

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    SchemaValidator.validate('src/schemas/fake-rest-api/book.schema.json', response.body);
    expect((response.body as Book).pageCount).toEqual(expect.any(Number));
  });

  test('create book response schema', async ({ booksApi, bookFactory }) => {
    const payload = bookFactory.createPredictable();
    const response = await booksApi.createBook(payload);

    ResponseValidator.assertStatus(response, 200);
    SchemaValidator.validate('src/schemas/fake-rest-api/book.schema.json', response.body);
  });

  test('authors list schema', async ({ authorsApi }) => {
    const response = await authorsApi.getAuthors();

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    SchemaValidator.validate('src/schemas/fake-rest-api/authors.schema.json', response.body);
    expect((response.body as Author[]).length).toBeGreaterThan(0);
  });

  test('single author schema', async ({ authorsApi }) => {
    const response = await authorsApi.getAuthor(1);

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    SchemaValidator.validate('src/schemas/fake-rest-api/author.schema.json', response.body);
  });
});
