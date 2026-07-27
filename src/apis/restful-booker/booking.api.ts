import type { ApiClient, ApiResponse } from '../../clients/api-client';
import type {
  Booking,
  BookingFilterParams,
  BookingId,
  CreateBookingResponse,
  PartialBookingUpdate,
} from '../../types/booking.types';

export class BookingApi {
  constructor(private readonly client: ApiClient) {}

  async createBooking(booking: Booking): Promise<ApiResponse<CreateBookingResponse>> {
    return this.client.post<CreateBookingResponse>('/booking', {
      data: booking,
    });
  }

  async getBooking(bookingId: number): Promise<ApiResponse<Booking | string>> {
    return this.client.get<Booking | string>(`/booking/${bookingId}`);
  }

  async getBookingIds(filters?: BookingFilterParams): Promise<ApiResponse<BookingId[]>> {
    return this.client.get<BookingId[]>('/booking', {
      params: filters as Record<string, string | number | boolean | undefined> | undefined,
    });
  }

  async updateBooking(
    bookingId: number,
    booking: Booking,
    token: string,
  ): Promise<ApiResponse<Booking | string>> {
    return this.client.put<Booking | string>(`/booking/${bookingId}`, {
      data: booking,
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  async partialUpdateBooking(
    bookingId: number,
    update: PartialBookingUpdate,
    token: string,
  ): Promise<ApiResponse<Booking | string>> {
    return this.client.patch<Booking | string>(`/booking/${bookingId}`, {
      data: update,
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  async deleteBooking(bookingId: number, token: string): Promise<ApiResponse<string>> {
    return this.client.delete<string>(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  async updateBookingWithoutAuth(
    bookingId: number,
    booking: Booking,
  ): Promise<ApiResponse<Booking | string>> {
    return this.client.put<Booking | string>(`/booking/${bookingId}`, {
      data: booking,
    });
  }

  async partialUpdateBookingWithoutAuth(
    bookingId: number,
    update: PartialBookingUpdate,
  ): Promise<ApiResponse<Booking | string>> {
    return this.client.patch<Booking | string>(`/booking/${bookingId}`, {
      data: update,
    });
  }

  async deleteBookingWithoutAuth(bookingId: number): Promise<ApiResponse<string>> {
    return this.client.delete<string>(`/booking/${bookingId}`);
  }
}
