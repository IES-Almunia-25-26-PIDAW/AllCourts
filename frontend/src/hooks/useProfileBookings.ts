import { useCallback } from "react";
import { getBookingsByUserId } from "@/api/bookingApi";
import type { Booking } from "@/types/booking";
import { useAsyncResource } from "./useAsyncResource";

export function useProfileBookings(userId?: string) {
	const loadBookings = useCallback(async () => {
		if (!userId) {
			throw new Error("No se encontró el usuario.");
		}

		return getBookingsByUserId(userId);
	}, [userId]);

	const { data, loading, error } = useAsyncResource<Booking[]>(loadBookings, Boolean(userId));

	return {
		bookings: data ?? [],
		loading,
		error,
	};
}