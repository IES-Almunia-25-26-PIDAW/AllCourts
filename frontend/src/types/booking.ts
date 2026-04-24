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
  court_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
}

export interface CreateBookingResponse {
  message: string;
  id: number;
  total_price: number;
}

export interface BookingAvailabilitySlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface CourtAvailabilityResponse {
  court_id: number;
  date: string;
  day_of_week: number;
  schedule_found: boolean;
  is_closed: boolean;
  opening_time: string | null;
  closing_time: string | null;
  duration_min: number;
  slot_step_min: number;
  suggested_durations: number[];
  slots: BookingAvailabilitySlot[];
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
