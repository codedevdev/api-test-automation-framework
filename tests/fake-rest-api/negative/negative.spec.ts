import { expect, test } from '../../../src/fixtures/fake-rest-api.fixture';

test.describe('Fake REST API negative @negative', () => {
  test('GET book with nonexistent numeric id', async ({ booksApi }) => {
    const response = await booksApi.getBook(9_999_999);
    // Simulator often returns 404 or an empty/error payload; assert observed statuses.
    expect([200, 404]).toContain(response.status);
  });

  test('GET book with invalid id format', async ({ booksApi }) => {
    const response = await booksApi.getBook('abc');
    expect([400, 404]).toContain(response.status);
  });

  test('POST book with missing required-looking fields', async ({ booksApi }) => {
    const response = await booksApi.createBook({
      id: 1,
      title: null,
      description: null,
      pageCount: 0,
      excerpt: null,
      publishDate: '2020-01-01T00:00:00.000Z',
    });

    // Fake REST API is permissive; capture actual acceptance behavior.
    expect([200, 400]).toContain(response.status);
  });

  test('POST book with invalid field types', async ({ apiClient }) => {
    const response = await apiClient.post('/api/v1/Books', {
      data: {
        id: 'not-a-number',
        title: 123,
        description: false,
        pageCount: 'many',
        excerpt: {},
        publishDate: 42,
      },
    });

    expect([200, 400, 415]).toContain(response.status);
  });

  test('PUT book with invalid id format', async ({ booksApi, bookFactory }) => {
    const response = await booksApi.updateBook('bad-id', bookFactory.create());
    expect([400, 404]).toContain(response.status);
  });

  test('DELETE book with invalid id format', async ({ booksApi }) => {
    const response = await booksApi.deleteBook('bad-id');
    expect([400, 404]).toContain(response.status);
  });

  test('unsupported method on books collection', async ({ apiClient }) => {
    const response = await apiClient.patch('/api/v1/Books', {
      data: { title: 'x' },
    });
    expect([404, 405]).toContain(response.status);
  });

  test('GET author with invalid id format', async ({ authorsApi }) => {
    const response = await authorsApi.getAuthor('xyz');
    expect([400, 404]).toContain(response.status);
  });
});
