import { uploadCourtImage } from '@/api/courtApi';
import { useAppDispatch } from '@/store/hooks';
import { createCourt, updateCourt } from '@/store/slices/managerSlice';
import type { Club } from '@/types/club';
import type { Court, CreateCourtDTO, Sport, SurfaceType, UpdateCourtDTO } from '@/types/court';
import { SPORT_LABELS, SURFACE_LABELS } from '@/types/court';
import { getApiUrl } from '@/utils/runtimeConfig';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CourtFormModal.module.scss';

type CourtFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  court?: Court;
  clubs: Club[];
};

export default function CourtFormModal({ isOpen, onClose, court, clubs }: CourtFormModalProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [clubId, setClubId] = useState<number>(clubs[0]?.id ?? court?.club_id ?? 0);
  const [sport, setSport] = useState<Sport>('padel');
  const [surfaceType, setSurfaceType] = useState<SurfaceType>('dura');
  const [isIndoor, setIsIndoor] = useState<boolean>(court?.is_indoor ?? false);
  const [price60, setPrice60] = useState('');
  const [price90, setPrice90] = useState('');
  const [price120, setPrice120] = useState('');
  const [minUnit, setMinUnit] = useState('60');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (court) {
      setName(court.name ?? '');
      setClubId(court.club_id ?? clubs[0]?.id ?? 0);
      setSport(court.sport ?? 'padel');
      setSurfaceType(court.surface_type ?? 'dura');
      setIsIndoor(court.is_indoor ?? false);
      setPrice60(String(court.price_60 ?? ''));
      setPrice90(String(court.price_90 ?? ''));
      setPrice120(String(court.price_120 ?? ''));
      setMinUnit(String(court.min_unit_min ?? 60));
      setImageUrl(court.image_url ?? '');
      setDescription(court.description ?? '');
    } else {
      setName('');
      setClubId(clubs[0]?.id ?? 0);
      setSport('padel');
      setSurfaceType('dura');
      setIsIndoor(false);
      setPrice60('');
      setPrice90('');
      setPrice120('');
      setMinUnit('60');
      setImageUrl('');
      setDescription('');
    }
    setFormError(null);
    setSubmitting(false);
    setImageFile(null);
    setPreviewUrl(
      court?.image_url
        ? court.image_url.startsWith('http')
          ? court.image_url
          : `${getApiUrl()}${court.image_url}`
        : null
    );
  }, [court, clubs, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Revoke object URL when preview changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) {
    return null;
  }

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      // Basic client-side validation
      if (!name.trim()) {
        throw new Error(t('courts.form_error_name_required'));
      }
      if (!clubId || clubId <= 0) {
        throw new Error(t('courts.form_error_club_required'));
      }
      const p60 = parseFloat(price60);
      const p90 = parseFloat(price90);
      const p120 = parseFloat(price120);
      if (Number.isNaN(p60) || Number.isNaN(p90) || Number.isNaN(p120)) {
        throw new Error(t('courts.form_error_price_invalid'));
      }
      const minUnitInt = parseInt(minUnit);
      if (Number.isNaN(minUnitInt) || minUnitInt < 15 || minUnitInt > 120) {
        throw new Error(t('courts.form_error_min_unit_invalid'));
      }
      let finalImageUrl = imageUrl;
      if (imageFile !== null) {
        setUploadingImage(true);
        try {
          const res = await uploadCourtImage(imageFile);
          finalImageUrl = res.url;
          setImageUrl(res.url);
          setPreviewUrl(res.fullUrl);
        } finally {
          setUploadingImage(false);
        }
      }
      const finalDescription = description.trim() === '' ? undefined : description.trim();
      if (court) {
        const data: UpdateCourtDTO = {
          name,
          sport,
          surface_type: surfaceType,
          price_60: parseFloat(price60),
          price_90: parseFloat(price90),
          price_120: parseFloat(price120),
          min_unit_min: parseInt(minUnit),
          image_url: finalImageUrl,
          description: finalDescription,
          is_indoor: isIndoor
        };
        await dispatch(updateCourt({ id: court.id, data })).unwrap();
      } else {
        const data: CreateCourtDTO = {
          club_id: clubId,
          name,
          sport,
          surface_type: surfaceType,
          price_60: parseFloat(price60),
          price_90: parseFloat(price90),
          price_120: parseFloat(price120),
          min_unit_min: parseInt(minUnit),
          image_url: finalImageUrl,
          description: finalDescription,
          is_indoor: isIndoor
        };
        await dispatch(createCourt(data)).unwrap();
      }
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('courts.form_error_save');
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderInner}>
            <h2 className={styles.modalTitle}>{court ? t('courts.form_edit_title') : t('courts.form_new_title')}</h2>
            <p className={styles.modalSubtitle}>{t('courts.form_subtitle') || ''}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>
        {formError && <p className={styles.errorMsg}>{formError}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.section} aria-labelledby="general-info">
            <div className={styles.sectionTitle} id="general-info">
              {t('manager.general') || ''}
            </div>
            <div className={styles.sectionGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-name">
                  {t('courts.form_name')}
                </label>
                <input
                  id="court-name"
                  className={styles.input}
                  type="text"
                  placeholder={t('courts.form_name')}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              {!court && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="court-club">
                    {t('courts.form_club')}
                  </label>
                  <select
                    id="court-club"
                    className={styles.select}
                    value={clubId}
                    onChange={(event) => setClubId(Number(event.target.value))}
                    required
                  >
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="config-info">
            <div className={styles.sectionTitle} id="config-info">
              {t('courts.configuration') || ''}
            </div>
            <div className={styles.sectionGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-sport">
                  {t('courts.form_sport')}
                </label>
                <select
                  id="court-sport"
                  className={styles.select}
                  value={sport}
                  onChange={(event) => setSport(event.target.value as Sport)}
                >
                  {Object.entries(sportLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-surface">
                  {t('courts.form_surface')}
                </label>
                <select
                  id="court-surface"
                  className={styles.select}
                  value={surfaceType}
                  onChange={(event) => setSurfaceType(event.target.value as SurfaceType)}
                >
                  {Object.entries(surfaceLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-indoor">
                  {t('courts.form_type')}
                </label>
                <select
                  id="court-indoor"
                  className={styles.select}
                  value={isIndoor ? 'true' : 'false'}
                  onChange={(event) => setIsIndoor(event.target.value === 'true')}
                >
                  <option value="false">{t('courts.form_outdoor')}</option>
                  <option value="true">{t('courts.form_indoor')}</option>
                </select>
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="pricing-info">
            <div className={styles.sectionTitle} id="pricing-info">
              {t('courts.pricing') || ''}
            </div>
            <div className={styles.sectionGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-price-60">
                  {t('courts.form_price_60')}
                </label>
                <input
                  id="court-price-60"
                  className={styles.input}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price60}
                  onChange={(event) => setPrice60(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-price-90">
                  {t('courts.form_price_90')}
                </label>
                <input
                  id="court-price-90"
                  className={styles.input}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price90}
                  onChange={(event) => setPrice90(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-price-120">
                  {t('courts.form_price_120')}
                </label>
                <input
                  id="court-price-120"
                  className={styles.input}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price120}
                  onChange={(event) => setPrice120(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="court-min-unit">
                  {t('courts.form_min_unit')}
                </label>
                <select
                  id="court-min-unit"
                  className={styles.select}
                  value={minUnit}
                  onChange={(event) => setMinUnit(event.target.value)}
                >
                  <option value="30">30 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                </select>
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="media-info">
            <div className={styles.sectionTitle} id="media-info">
              {t('manager.media') || ''}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="court-image">
                {t('courts.form_image')}
              </label>
              <input
                id="court-image"
                className={styles.input}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (file) {
                    const obj = URL.createObjectURL(file);
                    setPreviewUrl(obj);
                  } else {
                    setPreviewUrl(
                      court?.image_url
                        ? court.image_url.startsWith('http')
                          ? court.image_url
                          : `${getApiUrl()}${court.image_url}`
                        : null
                    );
                  }
                }}
              />
              <div className={styles.helperText}>{t('courts.form_image_help') || ''}</div>
              {previewUrl && (
                <img src={previewUrl} alt="court-preview" className={styles.imagePreview} />
              )}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="court-description">
                {t('courts.form_description')}
              </label>
              <textarea
                id="court-description"
                className={styles.textarea}
                placeholder={t('courts.form_description')}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </section>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={submitting}>
              {t('courts.form_cancel')}
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={submitting || uploadingImage}>
              {submitting || uploadingImage
                ? t('courts.form_saving')
                : court
                  ? t('courts.form_save')
                  : t('courts.form_create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
