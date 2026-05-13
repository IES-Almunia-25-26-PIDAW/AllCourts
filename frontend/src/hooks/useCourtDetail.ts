import { getCourtById } from '@/api/courtApi';
import type { CourtWithClub } from '@/types/court';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsyncResource } from './useAsyncResource';

export function useCourtDetail(courtId?: string) {
  const { t } = useTranslation();
  const loadCourt = useCallback(async () => {
    if (!courtId) {
      throw new Error(t('courts.error_not_found'));
    }

    return getCourtById(courtId);
  }, [courtId]);

  const { data, loading, error } = useAsyncResource<CourtWithClub>(loadCourt, Boolean(courtId));

  return {
    court: data,
    loading,
    error
  };
}
