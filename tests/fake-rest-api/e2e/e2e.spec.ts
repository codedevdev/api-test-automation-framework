import { expect, test } from '../../../src/fixtures/fake-rest-api.fixture';
import type { Author } from '../../../src/types/author.types';
import type { Book } from '../../../src/types/book.types';
import { ResponseValidator } from '../../../src/utils/response-validator';

test.describe('Fake REST API e2e @e2e', () => {
  test('simulated book workflow create update delete', async ({ booksApi, bookFactory }) => {
    const createdPayload = bookFactory.create({
      id: 7777,
      title: 'Workflow Book',
      pageCount: 210,
    });

    const created = await booksApi.createBook(createdPayload);
    ResponseValidator.assertStatus(created, 200);
    expect((created.body as Book).title).toBe('Workflow Book');

    const updatedPayload = {
      ...createdPayload,
      title: 'Workflow Book Updated',
      pageCount: 250,
    };
    const updated = await booksApi.updateBook(createdPayload.id, updatedPayload);
    ResponseValidator.assertStatus(updated, 200);
    expect((updated.body as Book).title).toBe('Workflow Book Updated');
    expect((updated.body as Book).pageCount).toBe(250);

    const deleted = await booksApi.deleteBook(createdPayload.id);
    ResponseValidator.assertStatus(deleted, 200);

    // Simulator does not persist deletes; existing seeded ids still resolve.
    const seeded = await booksApi.getBook(1);
    ResponseValidator.assertStatus(seeded, 200);
    expect((seeded.body as Book).id).toBe(1);
  });

  test('book and authors related read workflow', async ({ booksApi, authorsApi }) => {
    const books = await booksApi.getBooks();
    ResponseValidator.assertStatus(books, 200);
    expect(books.body.length).toBeGreaterThan(0);

    const bookId = books.body[0]?.id;
    expect(bookId).toBeDefined();

    const book = await booksApi.getBook(bookId as number);
    ResponseValidator.assertStatus(book, 200);

    const authors = await authorsApi.getAuthorsByBook(bookId as number);
    ResponseValidator.assertStatus(authors, 200);
    expect(Array.isArray(authors.body)).toBeTruthy();

    if (authors.body.length > 0) {
      const first = authors.body[0] as Author;
      expect(first.idBook).toBe(bookId);
    }
  });
});
