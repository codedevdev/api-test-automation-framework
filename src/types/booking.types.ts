export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

export interface PartialBookingUpdate {
  firstname?: string;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  bookingdates?: Partial<BookingDates>;
  additionalneeds?: string;
}

export interface BookingId {
  bookingid: number;
}

export interface BookingFilterParams {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}
