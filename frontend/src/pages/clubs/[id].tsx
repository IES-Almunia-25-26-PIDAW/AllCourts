import { useClubDetail } from '@/hooks/useClubDetail';
import { useRouteQueryParam } from '@/hooks/useRouteQueryParam';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ClubDetail from '../../components/modules/clubs/ClubDetail';
import styles from './[id].module.scss';

//#region DOCUMENTATION
/**
 * @page ClubDetail
 * Vista de detalle de un club.
 * Muestra la información principal del club, un resumen de sus pistas y acceso de vuelta al listado.
 *
 * Secciones:
 *   Hero       → imagen principal, nombre, ciudad y descripción
 *   CourtsCard  → listado de pistas relacionadas con acceso a su detalle
 *   BackLink    → navegación de retorno al listado de clubes
 */
//#endregion

//#region FUNCTIONS
export default function ClubDetailPage() {
  const { t } = useTranslation();
  const { value: clubId } = useRouteQueryParam('id');
  const { club, loading, error } = useClubDetail(typeof clubId === 'string' ? clubId : undefined);

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>{t('clubs.loading')}</p>
      </main>
    );
  }

  if (error || !club) {
    return (
      <main className={styles.page}>
        <p className={styles.errorText}>{error}</p>
        <a href="/clubs" className={styles.backLink}>
          {t('clubs.back_to_list')}
        </a>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.detailNav}>
        <Link href="/clubs" className={styles.backLink}>
          {t('clubs.back_to_clubs')}
        </Link>
      </div>

      <ClubDetail club={club} />
    </main>
  );
}
//#endregion
