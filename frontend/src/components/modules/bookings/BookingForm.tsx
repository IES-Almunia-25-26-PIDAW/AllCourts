import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";
import { useAppDispatch } from "@/store/hooks";
import { createBooking } from "@/store/slices/bookingSlice";
import type { CourtWithClub } from "@/types/court";
import type { BookingAvailabilitySlot } from "@/types/booking";
import BookingCalendar from "./BookingCalendar";
import styles from "./BookingForm.module.scss";
import { useBookingAvailability } from "@/hooks/useBookingAvailability";
import {
  calculateEstimatedPrice,
  formatDurationMinutes,
  formatPrice,
  formatTimeRange,
  getDurationOptions,
} from "@/utils/formatters";

type BookingFormProps = {
  court: CourtWithClub;
};

export default function BookingForm({ court }: BookingFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const durationOptions = useMemo(
    () => getDurationOptions(Number(court.min_unit_min) || 30),
    [court.min_unit_min],
  );

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number>(
    durationOptions[0] ?? 60,
  );
  const [selectedSlot, setSelectedSlot] =
    useState<BookingAvailabilitySlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { availability, loading: loadingAvailability, error: availabilityError } = useBookingAvailability(
    court.id,
    selectedDate,
    selectedDuration,
  );

  const estimatedPrice = calculateEstimatedPrice(
    Number(court.price_60),
    Number(court.price_90),
    Number(court.price_120),
    selectedDuration,
  );

  useEffect(() => {
    setSelectedDuration(durationOptions[0] ?? 60);
    setSelectedDate("");
    setSelectedSlot(null);
    setSubmitting(false);
    setError(null);
  }, [court.id, durationOptions]);

  const slots = availability?.slots ?? [];
  const selectedSlotIsAvailable = selectedSlot
    ? slots.some(
        (slot) =>
          slot.start_time === selectedSlot.start_time &&
          slot.end_time === selectedSlot.end_time &&
          slot.available,
      )
    : false;

  const scheduleLabel = availability?.is_closed
    ? availability.schedule_found
      ? "La pista está cerrada ese día"
      : "No hay horario configurado para ese día"
    : availability
      ? `Horario ${availability.opening_time?.slice(0, 5)} - ${availability.closing_time?.slice(0, 5)}`
      : "Selecciona un día para ver los horarios";

  const reserveDisabled =
    !selectedDate ||
    !selectedSlot ||
    loadingAvailability ||
    submitting ||
    !!availability?.is_closed ||
    !selectedSlotIsAvailable;

  const handleReserve = async () => {
    if (!selectedDate || !selectedSlot) {
      setError("Selecciona un día y una hora disponibles.");
      return;
    }

    if (!user) {
      setError("Necesitas iniciar sesión para reservar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await dispatch(
        createBooking({
          court_id: court.id,
          date: selectedDate,
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          duration_min: selectedDuration,
        }),
      ).unwrap();

      await router.push({
        pathname: "/booking/payment",
        query: {
          bookingId: String(response.id),
          courtId: String(court.id),
          courtName: court.name,
          clubName: court.club_name ?? "",
          date: selectedDate,
          startTime: selectedSlot.start_time,
          endTime: selectedSlot.end_time,
          duration: String(selectedDuration),
          totalPrice: String(response.total_price),
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la reserva.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.eyebrow}>Reserva rápida</p>
          <h2 className={styles.title}>Elige día, hora y duración</h2>
          <p className={styles.subtitle}>
            Primero seleccionas el día. Después se muestran todos los huecos, y
            los no disponibles quedan desactivados.
          </p>
        </div>

        <div className={styles.priceTag}>Desde {formatPrice(estimatedPrice)}</div>
      </div>

      <div className={styles.grid}>
        <BookingCalendar value={selectedDate} onChange={setSelectedDate} />

        <div className={styles.field}>
          <div className={styles.slotsHeader}>
            <div>
              <p className={styles.label}>Duración</p>
              <p className={styles.hint}>
                Duración mínima de la pista: {formatDurationMinutes(court.min_unit_min)}
              </p>
            </div>
            <p className={styles.slotsMeta}>
              Precio estimado: {formatPrice(estimatedPrice)}
            </p>
          </div>

          <div className={styles.chipRow}>
            {durationOptions.map((duration) => (
              <button
                key={duration}
                type="button"
                className={`${styles.chipButton} ${selectedDuration === duration ? styles.chipButtonActive : ""}`}
                onClick={() => setSelectedDuration(duration)}
              >
                {formatDurationMinutes(duration)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Club</p>
            <p className={styles.summaryValue}>{court.club_name ?? "Club"}</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Hora elegida</p>
            <p className={styles.summaryValue}>
              {selectedSlot
                ? formatTimeRange(
                    selectedSlot.start_time,
                    selectedSlot.end_time,
                  )
                : "Pendiente"}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Total</p>
            <p className={styles.summaryValue}>{formatPrice(estimatedPrice)}</p>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.slotsHeader}>
            <div>
              <p className={styles.label}>Horas disponibles</p>
              <p className={styles.hint}>{scheduleLabel}</p>
            </div>
            <p className={styles.slotsMeta}>
              {availability
                ? `${slots.length} horas cargadas`
                : "Sin seleccionar"}
            </p>
          </div>

          {selectedDate && loadingAvailability ? (
            <p className={styles.notice}>Buscando horarios...</p>
          ) : null}

          {selectedDate && availability && !availability.is_closed ? (
            <div className={styles.slotGrid}>
              {slots.map((slot) => {
                const isActive =
                  selectedSlot?.start_time === slot.start_time &&
                  selectedSlot?.end_time === slot.end_time;

                return (
                  <button
                    key={`${slot.start_time}-${slot.end_time}`}
                    type="button"
                    disabled={!slot.available}
                    className={`${styles.slotButton} ${isActive ? styles.slotButtonActive : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <span className={styles.slotTime}>
                      {formatTimeRange(slot.start_time, slot.end_time)}
                    </span>
                    <span className={styles.slotState}>
                      {slot.available ? "Disponible" : "No disponible"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {selectedDate && availability && availability.is_closed ? (
            <p className={styles.notice}>
              No hay reservas posibles en ese día porque la pista está cerrada o
              no tiene horario configurado.
            </p>
          ) : null}
        </div>

        {availabilityError ? <p className={styles.errorText}>{availabilityError}</p> : null}
        {error ? <p className={styles.errorText}>{error}</p> : null}

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.reserveButton}
            onClick={handleReserve}
            disabled={reserveDisabled}
          >
            {submitting ? "Creando reserva..." : "Reservar y continuar al pago"}
          </button>

          <p className={styles.notice}>
            Al reservar se crea una reserva pendiente y luego irás a la carta de
            pago.
          </p>
        </div>
      </div>
    </section>
  );
}