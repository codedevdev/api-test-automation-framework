import { testConfig } from '../../../src/config/test-config';
import { expect, test } from '../../../src/fixtures/restful-booker.fixture';
import type { AuthResponse } from '../../../src/types/auth.types';
import type { Booking, CreateBookingResponse } from '../../../src/types/booking.types';
import { ResponseValidator } from '../../../src/utils/response-validator';
import { SchemaValidator } from '../../../src/utils/schema-validator';
import { TestDataCleaner } from '../../../src/utils/test-data-cleaner';

test.describe('Restful Booker contract @contract', () => {
  test('authentication response schema', async ({ authApi }) => {
    const response = await authApi.createToken(testConfig.bookerCredentials);

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    ResponseValidator.assertHeaderDefined(response, 'content-type');
    SchemaValidator.validate('src/schemas/restful-booker/auth.schema.json', response.body);
    expect((response.body as AuthResponse).token.length).toBeGreaterThan(0);
  });

  test('create booking response schema', async ({ bookingApi, bookingFactory, authToken }) => {
    const response = await bookingApi.createBooking(bookingFactory.create());

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    SchemaValidator.validate(
      'src/schemas/restful-booker/create-booking.schema.json',
      response.body,
    );

    const body = response.body as CreateBookingResponse;
    await TestDataCleaner.deleteBookingSafe(bookingApi, body.bookingid, authToken);
  });

  test('single booking response schema', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const response = await bookingApi.getBooking(bookingId);
    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    SchemaValidator.validate('src/schemas/restful-booker/booking.schema.json', response.body);
    expect((response.body as Booking).bookingdates.checkin).toBeTruthy();

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('booking IDs response schema', async ({ bookingApi }) => {
    const response = await bookingApi.getBookingIds();

    ResponseValidator.assertStatus(response, 200);
    ResponseValidator.assertJsonContentType(response);
    SchemaValidator.validate('src/schemas/restful-booker/booking-ids.schema.json', response.body);
  });
});
