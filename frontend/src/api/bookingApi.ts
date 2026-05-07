import { request } from "@/api/http";
import type {
  Booking,
  CreateBookingDTO,
  CreateBookingResponse,
  CourtAvailabilityResponse,
} from "@/types/booking";

export async function createBooking(
  payload: CreateBookingDTO,
): Promise<CreateBookingResponse> {
  return request<CreateBookingResponse>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCourtAvailability(
  courtId: string | number,
  date: string,
  durationMin: number,
): Promise<CourtAvailabilityResponse> {
  const query = new URLSearchParams({
    date,
    duration_min: String(durationMin),
  });

  return request<CourtAvailabilityResponse>(
    `/bookings/availability/${courtId}?${query.toString()}`,
  );
}

export async function getBookingsByUserId(
  userId: string,
): Promise<Booking[]> {
  return request<Booking[]>(`/bookings/user/${userId}`);
}

export async function cancelBooking(
  bookingId: number,
  cancelReason?: string,
): Promise<void> {
  return request<void>(`/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ cancel_reason: cancelReason }),
  });
}
