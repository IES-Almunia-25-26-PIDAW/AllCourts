import BookingForm from '@/components/modules/bookings/BookingForm';
import CourtDetail from '@/components/modules/courts/CourtDetail';
import { useCourtDetail } from '@/hooks/useCourtDetail';
import { useRouteQueryParam } from '@/hooks/useRouteQueryParam';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from './[id].module.scss';

//#region DOCUMENTATION
/**
 * @page CourtDetail
 * Vista de detalle de una pista.
 * Mantiene el retorno al club de origen para respetar el flujo club -> club[id] -> court -> court[id].
 *
 * Secciones:
 *   Hero       → imagen principal, nombre, club y superficie
 *   PriceCard  → precios por duración y nota de siguiente paso
 *   BackLink   → navegación de retorno al club
 */
//#endregion

//#region FUNCTIONS
export default function CourtDetailPage() {
  const { t } = useTranslation();
  const { value: courtId } = useRouteQueryParam('id');
  const { court, loading, error } = useCourtDetail(typeof courtId === 'string' ? courtId : undefined);

  const backHref = court?.club_id ? `/clubs/${court.club_id}` : '/clubs';

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>{t('courts.loading')}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.errorText}>{error}</p>
        <Link href={backHref} className={styles.backLink}>
          {t('clubs.back_to_clubs')}
        </Link>
      </main>
    );
  }

  if (!court) {
    return (
      <main className={styles.page}>
        <p>{t('courts.empty')}</p>
        <Link href={backHref} className={styles.backLink}>
          {t('clubs.back_to_clubs')}
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link href={backHref} className={styles.backLink}>
        {t('clubs.back_to_clubs')}
      </Link>

      <div className={styles.contentStack}>
        <CourtDetail court={court} />
        <BookingForm court={court} />
      </div>
    </main>
  );
}
//#endregion
