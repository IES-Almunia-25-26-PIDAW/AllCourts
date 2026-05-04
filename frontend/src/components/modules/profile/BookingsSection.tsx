import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BOOKING_STATUS_LABELS } from "@/types/booking";
import { formatLongDate, formatPrice, formatTimeRange } from "@/utils/formatters";
import type { Booking } from "@/types/booking";
import styles from "./BookingsSection.module.scss";

type BookingsSectionProps = {
  title: string;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  variant: "active" | "past";
};

const INITIAL_DISPLAY_COUNT = 2;

export default function BookingsSection({ title, bookings, loading, error, emptyMessage, variant }: BookingsSectionProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("en") ? "en-US" : "es-ES";
  const [expanded, setExpanded] = useState(false);

  const visibleBookings = useMemo(() => {
    const now = new Date();

    return bookings.filter((booking) => {
      const endDateTime = new Date(`${booking.date}T${booking.end_time}`);
      const isActive = booking.status !== "cancelled" && endDateTime >= now;
      return variant === "active" ? isActive : !isActive;
    });
  }, [bookings, variant]);

  const displayedBookings = expanded ? visibleBookings : visibleBookings.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.count}>{visibleBookings.length}</span>
      </div>

      {loading ? <p className={styles.state}>Cargando reservas...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {!loading && !error && visibleBookings.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : null}

      {!loading && !error && visibleBookings.length > 0 ? (
        <>
          <div className={styles.list}>
            {displayedBookings.map((booking) => (
              <article key={booking.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div>
                      <p className={styles.courtName}>
                        {booking.court_name || "Pista"}
                      </p>
                      <p className={styles.courtMeta}>
                        {booking.court_city
                          ? `${booking.court_city}`
                          : "Sin ubicación"}
                        {booking.court_address ? ` · ${booking.court_address}` : ""}
                      </p>
                    </div>

                    <span
                      className={`${styles.status} ${styles[booking.status]}`}
                    >
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </span>
                  </div>

                  <div className={styles.details}>
                    <span>
                      {formatLongDate(
                        booking.date,
                        locale,
                        "Fecha no disponible",
                      )}
                    </span>
                    <span>{formatTimeRange(booking.start_time, booking.end_time)}</span>
                    <span>{formatPrice(Number(booking.total_price))}</span>
                  </div>

                  {booking.cancel_reason ? (
                    <p className={styles.cancelReason}>
                      Motivo: {booking.cancel_reason}
                    </p>
                  ) : null}
                </article>
            ))}
          </div>
          {visibleBookings.length > INITIAL_DISPLAY_COUNT && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={styles.expandBtn}
            >
              {expanded ? "Ver menos" : `Ver más (${visibleBookings.length - INITIAL_DISPLAY_COUNT})`}
            </button>
          )}
        </>
      ) : null}
    </section>
  );
}