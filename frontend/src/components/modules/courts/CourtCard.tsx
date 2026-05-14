//#region MODULES
import { Court, SPORT_LABELS, SURFACE_LABELS } from '@/types/court';
import { formatPrice } from '@/utils/formatters';
import { resolveImageUrl } from '@/utils/imageUrl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CourtCard.module.scss';
//#endregion

/**
 * @component CourtCard
 * Tarjeta visual que representa una pista en el listado.
 * Muestra la imagen, deporte, precio de entrada, tipo de superficie,
 * descripción recortada, tabla de precios por duración y botón de reserva.
 *
 * Propiedades:
 *   court → objeto Court con todos los datos de la pista (imagen, nombre, descripción, precios, etc.)
 *
 * Lógica de precio de entrada:
 *   Se muestra el precio correspondiente a la duración mínima reservable.
 *   Si min_unit_min ≤ 60 → price_60 / Si ≤ 90 → price_90 / Si no → price_120
 *
 * Comportamiento:
 *   - Usa la tarifa mínima como precio destacado para la cabecera.
 *   - Muestra el desglose completo de precios para 60, 90 y 120 minutos.
 *   - Mantiene la tarjeta visualmente compacta para el listado general.
 */

//#region TYPES
interface CourtCardProps {
  court: Court;
}
//#endregion

//#region FUNCTIONS
const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
  const { t } = useTranslation();
  //#region VARIABLES
  // Calcula el precio principal a mostrar según la duración mínima reservable.
  const entryPrice =
    court.min_unit_min <= 60 ? court.price_60 : court.min_unit_min <= 90 ? court.price_90 : court.price_120;

  // Traduce la duración mínima a la etiqueta visible en la tarjeta.
  const entryLabel =
    court.min_unit_min <= 60
      ? t('courts.duration_60')
      : court.min_unit_min <= 90
        ? t('courts.duration_90')
        : t('courts.duration_120');
  const sportLabels: Record<keyof typeof SPORT_LABELS, string> = {
    tenis: t('courts.sport_tenis'),
    padel: t('courts.sport_padel'),
    pickleball: t('courts.sport_pickleball'),
    baloncesto_3x3: t('courts.sport_baloncesto_3x3'),
    baloncesto_5x5: t('courts.sport_baloncesto_5x5'),
    futbol_5: t('courts.sport_futbol_5'),
    futbol_7: t('courts.sport_futbol_7'),
    futbol_11: t('courts.sport_futbol_11'),
    voley: t('courts.sport_voley'),
    balonmano: t('courts.sport_balonmano')
  };
  const surfaceLabels: Record<keyof typeof SURFACE_LABELS, string> = {
    tierra_batida: t('courts.surface_tierra_batida'),
    cesped_natural: t('courts.surface_cesped_natural'),
    cesped_artificial: t('courts.surface_cesped_artificial'),
    dura: t('courts.surface_dura'),
    arena: t('courts.surface_arena'),
    parque: t('courts.surface_parque')
  };
  //#endregion

  return (
    <Link href={`/courts/${court.id}`} className={styles.cardLink}>
      <article className={styles.courtCard}>
        <div className={styles.imageContainer}>
          <Image
            src={resolveImageUrl(court.image_url)}
            alt={court.name}
            fill
            unoptimized
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={styles.sportBadge}>{sportLabels[court.sport]}</span>
          <div className={styles.priceTag}>
            {formatPrice(entryPrice)}
            <span className={styles.priceLabel}>/{entryLabel}</span>
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.name}>{court.name}</p>
          <p className={styles.surface}>{surfaceLabels[court.surface_type]}</p>

          <p className={styles.desc}>
            {court.description
              ? court.description.length > 80
                ? `${court.description.slice(0, 80)}...`
                : court.description
              : ''}
          </p>

          <div className={styles.prices}>
            <div className={styles.priceItem}>
              <span className={styles.priceDur}>{t('courts.duration_60')}</span>
              <span className={styles.priceVal}>{formatPrice(court.price_60)}</span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceDur}>{t('courts.duration_90')}</span>
              <span className={styles.priceVal}>{formatPrice(court.price_90)}</span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceDur}>{t('courts.duration_120')}</span>
              <span className={styles.priceVal}>{formatPrice(court.price_120)}</span>
            </div>
          </div>

          <span className={styles.bookBtn}>{t('courts.book')}</span>
        </div>
      </article>
    </Link>
  );
};
//#endregion

export default CourtCard;
