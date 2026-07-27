import type { BookingApi } from '../apis/restful-booker/booking.api';
import { logger } from './logger';

export class TestDataCleaner {
  static async deleteBookingSafe(
    bookingApi: BookingApi,
    bookingId: number,
    token: string,
  ): Promise<void> {
    try {
      await bookingApi.deleteBooking(bookingId, token);
      logger.info(`Cleaned up booking ${bookingId}`);
    } catch (error) {
      logger.warn(`Failed to clean up booking ${bookingId}`, error);
    }
  }

  static async deleteBookingsSafe(
    bookingApi: BookingApi,
    bookingIds: number[],
    token: string,
  ): Promise<void> {
    for (const bookingId of bookingIds) {
      await this.deleteBookingSafe(bookingApi, bookingId, token);
    }
  }
}
