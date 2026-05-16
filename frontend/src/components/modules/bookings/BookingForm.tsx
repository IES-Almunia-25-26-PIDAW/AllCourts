import { useBookingAvailability } from '@/hooks/useBookingAvailability';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearLastCreated, createBooking } from '@/store/slices/bookingSlice';
import type { BookingAvailabilitySlot } from '@/types/booking';
import type { CourtWithClub } from '@/types/court';
import {
  calculateEstimatedPrice,
  formatDurationMinutes,
  formatPrice,
  formatTimeRange,
  getDurationOptions
} from '@/utils/formatters';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BookingCalendar from './BookingCalendar';
import styles from './BookingForm.module.scss';

type BookingFormProps = {
  court: CourtWithClub;
};

export default function BookingForm({ court }: BookingFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  const durationOptions = useMemo(() => getDurationOptions(Number(court.min_unit_min) || 30), [court.min_unit_min]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(durationOptions[0] ?? 60);
  const [selectedSlot, setSelectedSlot] = useState<BookingAvailabilitySlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    availability,
    loading: loadingAvailability,
    error: availabilityError
  } = useBookingAvailability(court.id, selectedDate, selectedDuration);

  const slots = availability?.slots ?? [];
  const availableSlots = useMemo(() => slots.filter((slot) => slot.available), [slots]);
  const selectedSlotValue = selectedSlot ? `${selectedSlot.start_time}-${selectedSlot.end_time}` : '';

  const estimatedPrice = calculateEstimatedPrice(
    Number(court.price_60),
    Number(court.price_90),
    Number(court.price_120),
    selectedDuration
  );

  useEffect(() => {
    setSelectedDuration(durationOptions[0] ?? 60);
    setSelectedDate('');
    setSelectedSlot(null);
    setSubmitting(false);
    setError(null);
  }, [court.id, durationOptions]);

  const selectedSlotIsAvailable = selectedSlot
    ? availableSlots.some(
        (slot) =>
          slot.start_time === selectedSlot.start_time && slot.end_time === selectedSlot.end_time && slot.available
      )
    : false;

  const scheduleLabel = availability?.is_closed
    ? availability.schedule_found
      ? t('booking.schedule_closed')
      : t('booking.schedule_missing')
    : availability
      ? t('booking.schedule_range', {
          opening: availability.opening_time?.slice(0, 5),
          closing: availability.closing_time?.slice(0, 5)
        })
      : t('booking.select_day_hint');

  const reserveDisabled =
    !selectedDate ||
    !selectedSlot ||
    loadingAvailability ||
    submitting ||
    !!availability?.is_closed ||
    !selectedSlotIsAvailable;

  const handleReserve = async () => {
    if (!selectedDate || !selectedSlot) {
      setError(t('booking.error_select_slot'));
      return;
    }

    if (!user) {
      const currentPath = router.asPath;
      router.push(`/login?from=${encodeURIComponent(currentPath)}`);
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
          duration_min: selectedDuration
        })
      ).unwrap();

      await router.push({
        pathname: '/booking/payment',
        query: {
          bookingId: String(response.id),
          courtId: String(court.id),
          courtName: court.name,
          clubName: court.club_name ?? '',
          date: selectedDate,
          startTime: selectedSlot.start_time,
          endTime: selectedSlot.end_time,
          duration: String(selectedDuration),
          totalPrice: String(response.total_price)
        }
      });

      dispatch(clearLastCreated());
    } catch (err) {
      setError(err instanceof Error ? err.message : t('booking.error_create_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.eyebrow}>{t('booking.quick_reserve')}</p>
          <h2 className={styles.title}>{t('booking.title')}</h2>
          <p className={styles.subtitle}>{t('booking.subtitle')}</p>
        </div>

        <div className={styles.priceTag}>{t('booking.from', { price: formatPrice(estimatedPrice) })}</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.bookingTopRow}>
          <BookingCalendar value={selectedDate} onChange={setSelectedDate} />

          <div className={styles.bookingControls}>
            <div className={styles.controlCard}>
              <div className={styles.controlHeader}>
                <div>
                  <p className={styles.controlTitle}>{t('booking.duration_label')}</p>
                  <p className={styles.controlHint}>{t('booking.duration_hint', { min: formatDurationMinutes(court.min_unit_min) })}</p>
                </div>
                <p className={styles.slotsMeta}>
                  {t('booking.estimated_price')}: {formatPrice(estimatedPrice)}
                </p>
              </div>

              <select
                className={styles.slotSelect}
                value={String(selectedDuration)}
                onChange={(event) => setSelectedDuration(Number(event.target.value))}
              >
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>
                    {formatDurationMinutes(duration)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlCard}>
              <div className={styles.controlHeader}>
                <div>
                  <p className={styles.controlTitle}>{t('booking.available_hours')}</p>
                  <p className={styles.controlHint}>{scheduleLabel}</p>
                </div>
                <p className={styles.slotsMeta}>
                  {availability ? t('booking.slots_count', { count: availableSlots.length }) : t('booking.not_selected')}
                </p>
              </div>

              {selectedDate && loadingAvailability ? <p className={styles.notice}>{t('booking.searching_slots')}</p> : null}

              {selectedDate && availability && !availability.is_closed && availableSlots.length > 0 ? (
                <div className={styles.slotPickerWrap}>
                  <select
                    className={styles.slotSelect}
                    value={selectedSlotValue}
                    onChange={(event) => {
                      const chosenSlot = availableSlots.find(
                        (slot) => `${slot.start_time}-${slot.end_time}` === event.target.value
                      );
                      setSelectedSlot(chosenSlot ?? null);
                    }}
                  >
                    <option value="">{t('booking.not_selected')}</option>
                    {availableSlots.map((slot) => (
                      <option key={`${slot.start_time}-${slot.end_time}`} value={`${slot.start_time}-${slot.end_time}`}>
                        {formatTimeRange(slot.start_time, slot.end_time)}
                      </option>
                    ))}
                  </select>

                  <div className={styles.slotPreviewRow}>
                    <span className={styles.slotPreviewLabel}>{t('booking.summary.chosen_time')}</span>
                    <strong className={styles.slotPreviewValue}>
                      {selectedSlot ? formatTimeRange(selectedSlot.start_time, selectedSlot.end_time) : t('booking.summary.pending')}
                    </strong>
                  </div>
                </div>
              ) : null}

              {selectedDate && availability && !availability.is_closed && availableSlots.length === 0 ? (
                <p className={styles.notice}>{t('booking.no_reservations_possible')}</p>
              ) : null}

              {selectedDate && availability && availability.is_closed ? (
                <p className={styles.notice}>{t('booking.no_reservations_possible')}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>{t('booking.summary.club')}</p>
            <p className={styles.summaryValue}>{court.club_name ?? t('booking.summary.club_fallback')}</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>{t('booking.summary.chosen_time')}</p>
            <p className={styles.summaryValue}>
              {selectedSlot
                ? formatTimeRange(selectedSlot.start_time, selectedSlot.end_time)
                : t('booking.summary.pending')}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>{t('booking.summary.total')}</p>
            <p className={styles.summaryValue}>{formatPrice(estimatedPrice)}</p>
          </div>
        </div>

        {availabilityError ? <p className={styles.errorText}>{availabilityError}</p> : null}
        {error ? <p className={styles.errorText}>{error}</p> : null}

        <div className={styles.buttonRow}>
          <button type="button" className={styles.reserveButton} onClick={handleReserve} disabled={reserveDisabled}>
            {submitting ? t('booking.creating') : t('booking.reserve_continue')}
          </button>

          <p className={styles.notice}>{t('booking.reserve_note')}</p>
        </div>
      </div>
    </section>
  );
}
