export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: number;
  user_id: string;
  court_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  total_price: number;
  status: BookingStatus;
  cancel_reason?: string;
  created_at?: string;
}

export interface CreateBookingDTO {
  user_id: string;
  court_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  total_price: number;
}

export interface UpdateBookingDTO {
  status?: BookingStatus;
  cancel_reason?: string;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};
