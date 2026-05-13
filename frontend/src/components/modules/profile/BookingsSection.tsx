import { cancelBooking } from '@/api/bookingApi';
import type { Booking } from '@/types/booking';
import { BOOKING_STATUS_LABELS } from '@/types/booking';
import { formatLongDate, formatPrice, formatTimeRange } from '@/utils/formatters';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BookingsSection.module.scss';

type BookingsSectionProps = {
  title: string;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  variant: 'active' | 'past';
  onBookingStatusChange?: (bookingId: number, updates: Partial<Booking>) => void;
};

const INITIAL_DISPLAY_COUNT = 2;

export default function BookingsSection({
  title,
  bookings,
  loading,
  error,
  emptyMessage,
  variant,
  onBookingStatusChange
}: BookingsSectionProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'es-ES';
  const [expanded, setExpanded] = useState(false);
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [cancelReasonMap, setCancelReasonMap] = useState<Record<number, string>>({});
  const [cancelErrorId, setCancelErrorId] = useState<number | null>(null);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const handleCancel = async (bookingId: number) => {
    setCancelingId(bookingId);
    setCancelErrorId(null);
    try {
      await cancelBooking(bookingId, cancelReasonMap[bookingId]);
      onBookingStatusChange?.(bookingId, {
        status: 'cancelled',
        cancel_reason: cancelReasonMap[bookingId] || undefined
      });
      setLocalBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: 'cancelled' as const, cancel_reason: cancelReasonMap[bookingId] || undefined }
            : b
        )
      );
      setCancelReasonMap((prev) => ({ ...prev, [bookingId]: '' }));
    } catch {
      setCancelErrorId(bookingId);
    } finally {
      setCancelingId(null);
    }
  };

  const visibleBookings = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return localBookings.filter((booking) => {
      const bookingDate = new Date(`${booking.date}T00:00:00`);
      const isPastBooking = Number.isNaN(bookingDate.getTime()) || bookingDate < todayStart;
      const isActive = booking.status !== 'cancelled' && !isPastBooking;
      return variant === 'active' ? isActive : !isActive;
    });
  }, [localBookings, variant]);

  const displayedBookings = expanded ? visibleBookings : visibleBookings.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.count}>{visibleBookings.length}</span>
      </div>

      {loading ? <p className={styles.state}>{t('profile.bookings_loading')}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {!loading && !error && visibleBookings.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}

      {!loading && !error && visibleBookings.length > 0 ? (
        <>
          <div className={styles.list}>
            {displayedBookings.map((booking) => (
              <article key={booking.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <p className={styles.courtName}>{booking.court_name || t('profile.court_name_fallback')}</p>
                    <p className={styles.courtMeta}>
                      {booking.court_city ? `${booking.court_city}` : t('profile.court_location_fallback')}
                      {booking.court_address ? ` · ${booking.court_address}` : ''}
                    </p>
                  </div>

                  <span className={`${styles.status} ${styles[booking.status]}`}>
                    {t(BOOKING_STATUS_LABELS[booking.status])}
                  </span>
                </div>

                <div className={styles.details}>
                  <span>{formatLongDate(booking.date, locale, t('profile.date_not_available'))}</span>
                  <span>{formatTimeRange(booking.start_time, booking.end_time)}</span>
                  <span>{formatPrice(Number(booking.total_price))}</span>
                </div>

                {booking.cancel_reason ? (
                  <p className={styles.cancelReason}>
                    {t('profile.cancel_reason_prefix')}
                    {booking.cancel_reason}
                  </p>
                ) : null}

                {variant === 'active' && booking.status !== 'cancelled' && (
                  <>
                    <input
                      type="text"
                      value={cancelReasonMap[booking.id] || ''}
                      onChange={(e) => setCancelReasonMap((prev) => ({ ...prev, [booking.id]: e.target.value }))}
                      placeholder={t('profile.cancel_reason_placeholder')}
                      className={styles.cancelInput}
                    />
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelingId === booking.id}
                      className={styles.cancelBtn}
                    >
                      {cancelingId === booking.id ? t('profile.canceling') : t('profile.cancel_booking')}
                    </button>
                    {cancelErrorId === booking.id && <p className={styles.cancelError}>{t('profile.cancel_error')}</p>}
                  </>
                )}
              </article>
            ))}
          </div>

          {visibleBookings.length > INITIAL_DISPLAY_COUNT && (
            <button onClick={() => setExpanded(!expanded)} className={styles.expandBtn}>
              {expanded
                ? t('profile.show_less')
                : t('profile.show_more', { count: visibleBookings.length - INITIAL_DISPLAY_COUNT })}
            </button>
          )}
        </>
      ) : null}
    </section>
  );
}
