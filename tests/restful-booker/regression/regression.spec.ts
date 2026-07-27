import { expect, test } from '../../../src/fixtures/restful-booker.fixture';
import type { Booking, CreateBookingResponse } from '../../../src/types/booking.types';
import { ResponseValidator } from '../../../src/utils/response-validator';
import { TestDataCleaner } from '../../../src/utils/test-data-cleaner';

test.describe('Restful Booker regression @regression', () => {
  test('create booking with valid data and retrieve persisted booking', async ({
    bookingApi,
    bookingFactory,
    authToken,
  }) => {
    const payload = bookingFactory.create({ firstname: 'Pavlo', totalprice: 500 });
    const created = await bookingApi.createBooking(payload);
    ResponseValidator.assertStatus(created, 200);

    const bookingId = (created.body as CreateBookingResponse).bookingid;
    const fetched = await bookingApi.getBooking(bookingId);
    ResponseValidator.assertStatus(fetched, 200);

    const body = fetched.body as Booking;
    expect(body.firstname).toBe('Pavlo');
    expect(body.totalprice).toBe(500);
    expect(body.lastname).toBe(payload.lastname);

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('full booking update', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;
    const updatedPayload = bookingFactory.create({
      firstname: 'Updated',
      lastname: 'Guest',
      totalprice: 999,
      depositpaid: false,
      additionalneeds: 'Quiet room',
    });

    const updated = await bookingApi.updateBooking(bookingId, updatedPayload, authToken);
    ResponseValidator.assertStatus(updated, 200);
    const body = updated.body as Booking;
    expect(body.firstname).toBe('Updated');
    expect(body.totalprice).toBe(999);

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('partial booking update', async ({ bookingApi, bookingFactory, authToken }) => {
    const original = bookingFactory.create({ firstname: 'Keep', lastname: 'Me', totalprice: 250 });
    const created = await bookingApi.createBooking(original);
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const patched = await bookingApi.partialUpdateBooking(
      bookingId,
      { firstname: 'Patched' },
      authToken,
    );
    ResponseValidator.assertStatus(patched, 200);
    const body = patched.body as Booking;
    expect(body.firstname).toBe('Patched');
    expect(body.lastname).toBe('Me');
    expect(body.totalprice).toBe(250);

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('delete booking', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create());
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const deleted = await bookingApi.deleteBooking(bookingId, authToken);
    ResponseValidator.assertStatus(deleted, 201);

    const fetched = await bookingApi.getBooking(bookingId);
    ResponseValidator.assertStatus(fetched, 404);
  });

  test('filter booking IDs by first name', async ({ bookingApi, bookingFactory, authToken }) => {
    const uniqueFirst = `Fn${Date.now()}`;
    const created = await bookingApi.createBooking(
      bookingFactory.create({ firstname: uniqueFirst }),
    );
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const filtered = await bookingApi.getBookingIds({ firstname: uniqueFirst });
    ResponseValidator.assertStatus(filtered, 200);
    expect(filtered.body.some((item) => item.bookingid === bookingId)).toBeTruthy();

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('filter booking IDs by last name', async ({ bookingApi, bookingFactory, authToken }) => {
    const uniqueLast = `Ln${Date.now()}`;
    const created = await bookingApi.createBooking(bookingFactory.create({ lastname: uniqueLast }));
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const filtered = await bookingApi.getBookingIds({ lastname: uniqueLast });
    ResponseValidator.assertStatus(filtered, 200);
    expect(filtered.body.some((item) => item.bookingid === bookingId)).toBeTruthy();

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('filter booking IDs by check-in date', async ({ bookingApi, bookingFactory, authToken }) => {
    const checkin = '2030-01-10';
    const created = await bookingApi.createBooking(
      bookingFactory.create({
        bookingdates: { checkin, checkout: '2030-01-15' },
      }),
    );
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const filtered = await bookingApi.getBookingIds({ checkin });
    ResponseValidator.assertStatus(filtered, 200);
    expect(Array.isArray(filtered.body)).toBeTruthy();

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('filter booking IDs by check-out date', async ({
    bookingApi,
    bookingFactory,
    authToken,
  }) => {
    const checkout = '2030-02-20';
    const created = await bookingApi.createBooking(
      bookingFactory.create({
        bookingdates: { checkin: '2030-02-10', checkout },
      }),
    );
    const bookingId = (created.body as CreateBookingResponse).bookingid;

    const filtered = await bookingApi.getBookingIds({ checkout });
    ResponseValidator.assertStatus(filtered, 200);
    expect(Array.isArray(filtered.body)).toBeTruthy();

    await TestDataCleaner.deleteBookingSafe(bookingApi, bookingId, authToken);
  });

  test('booking with minimum reasonable price', async ({
    bookingApi,
    bookingFactory,
    authToken,
  }) => {
    const created = await bookingApi.createBooking(bookingFactory.create({ totalprice: 1 }));
    ResponseValidator.assertStatus(created, 200);
    expect((created.body as CreateBookingResponse).booking.totalprice).toBe(1);
    await TestDataCleaner.deleteBookingSafe(
      bookingApi,
      (created.body as CreateBookingResponse).bookingid,
      authToken,
    );
  });

  test('booking with high price', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(bookingFactory.create({ totalprice: 99999 }));
    ResponseValidator.assertStatus(created, 200);
    expect((created.body as CreateBookingResponse).booking.totalprice).toBe(99999);
    await TestDataCleaner.deleteBookingSafe(
      bookingApi,
      (created.body as CreateBookingResponse).bookingid,
      authToken,
    );
  });

  test('booking with additional needs', async ({ bookingApi, bookingFactory, authToken }) => {
    const created = await bookingApi.createBooking(
      bookingFactory.create({ additionalneeds: 'Extra towels' }),
    );
    ResponseValidator.assertStatus(created, 200);
    expect((created.body as CreateBookingResponse).booking.additionalneeds).toBe('Extra towels');
    await TestDataCleaner.deleteBookingSafe(
      bookingApi,
      (created.body as CreateBookingResponse).bookingid,
      authToken,
    );
  });

  test('booking without additional needs', async ({ bookingApi, bookingFactory, authToken }) => {
    const payload = bookingFactory.createWithoutAdditionalNeeds();
    const created = await bookingApi.createBooking(payload);
    ResponseValidator.assertStatus(created, 200);
    expect((created.body as CreateBookingResponse).booking.firstname).toBe(payload.firstname);
    await TestDataCleaner.deleteBookingSafe(
      bookingApi,
      (created.body as CreateBookingResponse).bookingid,
      authToken,
    );
  });

  test('special characters in supported string fields', async ({
    bookingApi,
    bookingFactory,
    authToken,
  }) => {
    const created = await bookingApi.createBooking(
      bookingFactory.create({
        firstname: "O'Neil",
        lastname: 'Müller-Śmith',
        additionalneeds: 'Room with "view" & balcony',
      }),
    );
    ResponseValidator.assertStatus(created, 200);
    const booking = (created.body as CreateBookingResponse).booking;
    expect(booking.firstname).toBe("O'Neil");
    expect(booking.lastname).toBe('Müller-Śmith');

    await TestDataCleaner.deleteBookingSafe(
      bookingApi,
      (created.body as CreateBookingResponse).bookingid,
      authToken,
    );
  });
});
