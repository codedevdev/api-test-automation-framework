import { expect, test } from '../../../src/fixtures/restful-booker.fixture';
import type { Booking, CreateBookingResponse } from '../../../src/types/booking.types';
import { ResponseValidator } from '../../../src/utils/response-validator';
import { TestDataCleaner } from '../../../src/utils/test-data-cleaner';

test.describe('Restful Booker e2e @e2e', () => {
  test('booking lifecycle workflow', async ({ bookingApi, bookingFactory, authToken }) => {
    const original = bookingFactory.create({
      firstname: 'Lifecycle',
      lastname: 'Guest',
      totalprice: 420,
      depositpaid: true,
      additionalneeds: 'Breakfast',
    });

    const created = await bookingApi.createBooking(original);
    ResponseValidator.assertStatus(created, 200);
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const fetched = await bookingApi.getBooking(bookingId);
    ResponseValidator.assertStatus(fetched, 200);
    expect((fetched.body as Booking).firstname).toBe('Lifecycle');
    expect((fetched.body as Booking).totalprice).toBe(420);

    const fullUpdate = bookingFactory.create({
      firstname: 'Full',
      lastname: 'Update',
      totalprice: 700,
      depositpaid: false,
      additionalneeds: 'Parking',
    });
    const updated = await bookingApi.updateBooking(bookingId, fullUpdate, authToken);
    ResponseValidator.assertStatus(updated, 200);
    expect((updated.body as Booking).firstname).toBe('Full');
    expect((updated.body as Booking).totalprice).toBe(700);

    const patched = await bookingApi.partialUpdateBooking(
      bookingId,
      { firstname: 'Partial' },
      authToken,
    );
    ResponseValidator.assertStatus(patched, 200);
    const patchedBody = patched.body as Booking;
    expect(patchedBody.firstname).toBe('Partial');
    expect(patchedBody.lastname).toBe('Update');
    expect(patchedBody.totalprice).toBe(700);

    const deleted = await bookingApi.deleteBooking(bookingId, authToken);
    ResponseValidator.assertStatus(deleted, 201);

    const missing = await bookingApi.getBooking(bookingId);
    ResponseValidator.assertStatus(missing, 404);
  });

  test('multiple booking filter and cleanup', async ({ bookingApi, bookingFactory, authToken }) => {
    const marker = `Multi${Date.now()}`;
    const ids: number[] = [];

    try {
      for (let i = 0; i < 3; i += 1) {
        const created = await bookingApi.createBooking(
          bookingFactory.create({ firstname: marker, lastname: `User${i}` }),
        );
        ResponseValidator.assertStatus(created, 200);
        ids.push((created.body as CreateBookingResponse).bookingid);
      }

      const filtered = await bookingApi.getBookingIds({ firstname: marker });
      ResponseValidator.assertStatus(filtered, 200);

      for (const id of ids) {
        expect(filtered.body.some((item) => item.bookingid === id)).toBeTruthy();
      }
    } finally {
      await TestDataCleaner.deleteBookingsSafe(bookingApi, ids, authToken);
    }
  });
});
