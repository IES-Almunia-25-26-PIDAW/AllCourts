import { getClubById } from '@/api/clubApi';
import type { ClubWithManager } from '@/types/club';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsyncResource } from './useAsyncResource';

export function useClubDetail(clubId?: string) {
  const { t } = useTranslation();
  const loadClub = useCallback(async () => {
    if (!clubId) {
      throw new Error(t('clubs.error_not_found'));
    }

    return getClubById(clubId);
  }, [clubId]);

  const { data, loading, error } = useAsyncResource<ClubWithManager>(loadClub, Boolean(clubId));

  return {
    club: data,
    loading,
    error
  };
}
