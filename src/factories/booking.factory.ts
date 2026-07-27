import { faker } from '@faker-js/faker';
import type { Booking } from '../types/booking.types';

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export class BookingFactory {
  static create(overrides: Partial<Booking> = {}): Booking {
    const checkinDate = faker.date.soon({ days: 30 });
    const checkoutDate = faker.date.soon({ days: 20, refDate: checkinDate });

    const booking: Booking = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 50, max: 1500 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: formatDate(checkinDate),
        checkout: formatDate(checkoutDate),
      },
      additionalneeds: faker.helpers.arrayElement([
        'Breakfast',
        'Late checkout',
        'Airport transfer',
      ]),
    };

    return {
      ...booking,
      ...overrides,
      bookingdates: {
        ...booking.bookingdates,
        ...overrides.bookingdates,
      },
    };
  }

  static createWithoutAdditionalNeeds(overrides: Partial<Booking> = {}): Booking {
    const booking = this.create(overrides);
    delete booking.additionalneeds;
    return booking;
  }
}
