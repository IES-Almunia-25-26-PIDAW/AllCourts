import { getBookingsByUserId } from '@/api/bookingApi';
import type { Booking } from '@/types/booking';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsyncResource } from './useAsyncResource';

export function useProfileBookings(userId?: string) {
  const { t } = useTranslation();
  const loadBookings = useCallback(async () => {
    if (!userId) {
      throw new Error(t('profile.error_user_not_found'));
    }

    return getBookingsByUserId(userId);
  }, [userId]);

  const { data, loading, error } = useAsyncResource<Booking[]>(loadBookings, Boolean(userId));

  return {
    bookings: data ?? [],
    loading,
    error
  };
}
