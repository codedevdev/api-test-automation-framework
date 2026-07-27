import { testConfig } from '../../../src/config/test-config';
import { expect, test } from '../../../src/fixtures/restful-booker.fixture';
import type { AuthErrorResponse } from '../../../src/types/auth.types';
import type { CreateBookingResponse } from '../../../src/types/booking.types';
import { ResponseValidator } from '../../../src/utils/response-validator';
import { TestDataCleaner } from '../../../src/utils/test-data-cleaner';

test.describe('Restful Booker negative @negative', () => {
  test('authentication with invalid password', async ({ authApi }) => {
    const response = await authApi.createToken({
      username: testConfig.bookerCredentials.username,
      password: 'wrong-password',
    });

    // Restful Booker returns 200 with a reason payload for bad credentials.
    ResponseValidator.assertStatus(response, 200);
    const body = response.body as AuthErrorResponse;
    expect(body.reason).toMatch(/bad credentials/i);
  });

  test('authentication with invalid username', async ({ authApi }) => {
    const response = await authApi.createToken({
      username: 'not-a-real-user',
      password: testConfig.bookerCredentials.password,
    });

    ResponseValidator.assertStatus(response, 200);
    const body = response.body as AuthErrorResponse;
    expect(body.reason).toMatch(/bad credentials/i);
  });

  test('authentication with missing credentials', async ({ authApi }) => {
    const response = await authApi.createToken({
      username: '',
      password: '',
    });

    ResponseValidator.assertStatus(response, 200);
    const body = response.body as AuthErrorResponse;
    expect(body.reason).toMatch(/bad credentials/i);
  });

  test('retrieve booking with nonexistent ID', async ({ bookingApi }) => {
    const response = await bookingApi.getBooking(9_999_999);
    ResponseValidator.assertStatus(response, 404);
  });

  test('update without authentication', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;
    const payload = bookingFactory.create({ firstname: 'NoAuth' });

    const response = await bookingApi.updateBookingWithoutAuth(bookingId, payload);
    ResponseValidator.assertStatus(response, 403);

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('update with invalid token', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const response = await bookingApi.updateBooking(
      bookingId,
      bookingFactory.create({ firstname: 'BadToken' }),
      'invalid-token-value',
    );
    ResponseValidator.assertStatus(response, 403);

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('partial update without authentication', async ({
    bookingApi,
    bookingFactory,
    authToken,
  }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const response = await bookingApi.partialUpdateBookingWithoutAuth(bookingId, {
      firstname: 'Nope',
    });
    ResponseValidator.assertStatus(response, 403);

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('delete without authentication', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const response = await bookingApi.deleteBookingWithoutAuth(bookingId);
    ResponseValidator.assertStatus(response, 403);

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('malformed request body', async ({ apiClient }) => {
    const response = await apiClient.post('/booking', {
      data: 'this-is-not-json-object',
      headers: { 'Content-Type': 'application/json' },
    });

    // API often still responds 500/400 depending on parser path.
    expect([400, 500]).toContain(response.status);
  });

  test('missing required fields', async ({ apiClient }) => {
    const response = await apiClient.post('/booking', {
      data: { firstname: 'OnlyName' },
    });

    expect([400, 500]).toContain(response.status);
  });

  test('invalid field types', async ({ apiClient }) => {
    const response = await apiClient.post('/booking', {
      data: {
        firstname: 123,
        lastname: true,
        totalprice: 'expensive',
        depositpaid: 'yes',
        bookingdates: {
          checkin: '2026-01-01',
          checkout: '2026-01-05',
        },
      },
    });

    expect([200, 400, 500]).toContain(response.status);
  });

  test('invalid date format', async ({ apiClient }) => {
    const response = await apiClient.post('/booking', {
      data: {
        firstname: 'Date',
        lastname: 'Check',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '01-01-2026',
          checkout: 'not-a-date',
        },
      },
    });

    expect([200, 400, 500]).toContain(response.status);
  });

  test('checkout earlier than checkin is accepted by API (known limitation)', async ({
    bookingApi,
    bookingFactory,
    authToken,
  }) => {
    // Documented limitation: Restful Booker does not enforce date order.
    const payload = bookingFactory.create({
      bookingdates: {
        checkin: '2026-05-10',
        checkout: '2026-05-01',
      },
    });

    const response = await bookingApi.createBooking(payload);
    ResponseValidator.assertStatus(response, 200);
    const body = response.body as CreateBookingResponse;
    expect(body.booking.bookingdates.checkout < body.booking.bookingdates.checkin).toBeTruthy();

    await TestDataCleaner.deleteBookingSafe(bookingApi, body.bookingid, authToken);
  });

  test('unsupported HTTP method on booking collection', async ({ apiClient }) => {
    const response = await apiClient.patch('/booking', {
      data: { firstname: 'x' },
    });

    expect([404, 405]).toContain(response.status);
  });
});
