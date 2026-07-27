import { testConfig } from '../../../src/config/test-config';
import { expect, test } from '../../../src/fixtures/restful-booker.fixture';
import type { AuthResponse } from '../../../src/types/auth.types';
import type { Booking, CreateBookingResponse } from '../../../src/types/booking.types';
import { ResponseValidator } from '../../../src/utils/response-validator';
import { TestDataCleaner } from '../../../src/utils/test-data-cleaner';

test.describe('Restful Booker smoke @smoke', () => {
  test('returns a non-empty list of booking IDs', async ({ bookingApi }) => {
    const response = await bookingApi.getBookingIds();

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('bookingid');
  });

  test('successful authentication returns a token', async ({ authApi }) => {
    const response = await authApi.createToken(testConfig.bookerCredentials);

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    const body = response.body as AuthResponse;
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe('string');
  });

  test('create booking', async ({ bookingApi, bookingFactory, authToken }) => {
    const payload = bookingFactory.create();
    const response = await bookingApi.createBooking(payload);

    ResponseValidator.assertStatus(response, 200);
    const body = response.body as CreateBookingResponse;
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe(payload.firstname);

    await TestDataCleaner.deleteBookingSafe(bookingApi, body.bookingid, authToken);
  });

  test('retrieve booking by ID', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const response = await bookingApi.getBooking(bookingId);
    ResponseValidator.assertStatus(response, 200);
    const body = response.body as Booking;
    expect(body.firstname).toBeTruthy();
    expect(body.lastname).toBeTruthy();

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('basic response-time validation', async ({ bookingApi }) => {
    const response = await bookingApi.getBookingIds();
    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertResponseTime(response, testConfig.smokeResponseTimeMs);
  });
});
