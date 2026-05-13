import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type AsyncResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useAsyncResource<T>(loader: () => Promise<T>, enabled = true): AsyncResourceState<T> {
  const { t } = useTranslation();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const nextData = await loader();
        if (!cancelled) {
          setData(nextData);
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : t('errors.could_not_load'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [enabled, loader]);

  return { data, loading, error };
}
