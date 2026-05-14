//#region MODULES
import type { ClubWithManager } from '@/types/club';
import { resolveImageUrl } from '@/utils/imageUrl';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from './ClubCard.module.scss';
//#endregion

/**
 * @component ClubCard
 * Tarjeta visual que representa un club en el listado.
 * Muestra el logo, ciudad, nombre, descripción recortada, dirección
 * y el número de pistas disponibles.
 *
 * Propiedades:
 *   club        → objeto con los datos del club (logo, nombre, descripción, etc.)
 *   courtCount  → número de pistas del club (opcional, no se muestra si no se pasa)
 *   href        → ruta de navegación al detalle del club
 *
 * Comportamiento:
 *   - Recorta la descripción para mantener la tarjeta compacta.
 *   - Reutiliza next/image para optimizar la imagen del club.
 *   - Navega al detalle completo al pulsar sobre la tarjeta.
 */

//#region TYPES
interface ClubCardProps {
  club: ClubWithManager;
  href?: string;
  courtCount?: number;
  variant?: 'default' | 'detail';
}
//#endregion

//#region FUNCTIONS
const ClubCard = ({ club, href, courtCount, variant = 'default' }: ClubCardProps) => {
  const { t } = useTranslation();
  const coverImage = resolveImageUrl(club.logo_url);
  const description = club.description || t('clubs.no_description');
  const CardContent = (
    <div className={`${styles.clubCard} ${variant === 'detail' ? styles.detailCard : ''}`}>
      <div className={`${styles.imageContainer} ${variant === 'detail' ? styles.detailImageContainer : ''}`}>
        <Image
          src={coverImage}
          alt={club.name}
          fill
          unoptimized
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {variant !== 'detail' && <span className={styles.cityBadge}>{club.city || t('clubs.no_city')}</span>}
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{club.name}</p>

        <p className={styles.desc}>{description.length > 90 ? `${description.slice(0, 90)}...` : description}</p>

        <div className={styles.footer}>
          <span className={styles.address}>{club.address || t('clubs.no_address')}</span>

          {courtCount !== undefined && (
            <span className={styles.count}>
              {courtCount === 1
                ? t('clubs.courts_one', { count: courtCount })
                : t('clubs.courts_other', { count: courtCount })}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (!href) {
    return CardContent;
  }

  return (
    <Link href={href} className={styles.cardLink}>
      {CardContent}
    </Link>
  );
};
//#endregion

export default ClubCard;
