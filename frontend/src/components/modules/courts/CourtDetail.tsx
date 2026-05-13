import type { CourtWithClub } from '@/types/court';
import { SPORT_LABELS, SURFACE_LABELS } from '@/types/court';
import { formatPrice } from '@/utils/formatters';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import styles from './CourtDetail.module.scss';

interface CourtDetailProps {
  court: CourtWithClub;
}

export default function CourtDetail({ court }: CourtDetailProps) {
  const { t } = useTranslation();
  const coverImage = court.image_url || '/logoallcourts.png';
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

  return (
    <section className={styles.hero}>
      <div className={styles.heroImage}>
        <Image
          src={coverImage}
          alt={court.name}
          fill
          className={styles.heroImageMedia}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className={styles.heroCopy}>
        <p className={styles.sportTag}>{sportLabels[court.sport]}</p>

        <h1 className={styles.title}>{court.name}</h1>

        <p className={styles.meta}>
          {court.club_name ? court.club_name : t('courts.club_name_fallback')}
          {court.city ? ` · ${court.city}` : ''}
        </p>

        <div className={styles.chips}>
          <span className={styles.chip}>
            {t('courts.surface_label')}: {surfaceLabels[court.surface_type]}
          </span>
          <span className={styles.chip}>
            {t('courts.location_label')}: {court.address || t('courts.location_fallback')}
          </span>
        </div>

        <p className={styles.description}>{court.description || t('clubs.no_description')}</p>

        <div className={styles.priceCard}>
          <h2 className={styles.priceTitle}>{t('courts.price_title')}</h2>

          <div className={styles.priceGrid}>
            <div className={styles.priceItem}>
              <p className={styles.priceLabel}>{t('courts.duration_60')}</p>
              <strong className={styles.priceValue}>{formatPrice(Number(court.price_60))}</strong>
            </div>
            <div className={styles.priceItem}>
              <p className={styles.priceLabel}>{t('courts.duration_90')}</p>
              <strong className={styles.priceValue}>{formatPrice(Number(court.price_90))}</strong>
            </div>
            <div className={styles.priceItem}>
              <p className={styles.priceLabel}>{t('courts.duration_120')}</p>
              <strong className={styles.priceValue}>{formatPrice(Number(court.price_120))}</strong>
            </div>
          </div>

          <p className={styles.note}>{t('courts.booking_note')}</p>
        </div>
      </div>
    </section>
  );
}
