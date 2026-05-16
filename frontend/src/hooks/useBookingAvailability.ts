import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	clearAvailability,
	fetchCourtAvailability,
	selectAvailability,
	selectBookingError,
	selectBookingLoading,
} from "@/store/slices/bookingSlice";

/**
 * Carga la disponibilidad de una pista para una fecha y duración dadas.
 * Limpia la disponibilidad cuando faltan parámetros para evitar mostrar datos obsoletos.
 *
 * @param courtId Identificador de la pista.
 * @param date Fecha seleccionada.
 * @param durationMin Duración seleccionada en minutos.
 * @returns {object} Estado actual de la disponibilidad.
 */
export function useBookingAvailability(
	courtId?: string | number,
	date?: string,
	durationMin?: number,
) {
	const dispatch = useAppDispatch();
	const availability = useAppSelector(selectAvailability);
	const loading = useAppSelector(selectBookingLoading);
	const error = useAppSelector(selectBookingError);
	const isEnabled = Boolean(courtId) && Boolean(date) && Boolean(durationMin);
	const isCurrentAvailability =
		isEnabled &&
		availability !== null &&
		String(availability.court_id) === String(courtId) &&
		availability.date === date &&
		availability.duration_min === durationMin;

	useEffect(() => {
		if (!isEnabled) {
			dispatch(clearAvailability());
			return;
		}

		dispatch(
			fetchCourtAvailability({
				courtId: courtId as string | number,
				date: date as string,
				durationMin: durationMin as number,
			}),
		);
	}, [dispatch, isEnabled, courtId, date, durationMin]);

	return {
		availability: isCurrentAvailability ? availability : null,
		loading: isCurrentAvailability ? loading : false,
		error: isCurrentAvailability ? error : null,
	};
}
