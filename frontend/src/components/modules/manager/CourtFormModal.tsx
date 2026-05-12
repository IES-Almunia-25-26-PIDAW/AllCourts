import { useAppDispatch } from '@/store/hooks';
import { createCourt, updateCourt } from '@/store/slices/managerSlice';
import type { Club } from '@/types/club';
import type { Court, CreateCourtDTO, Sport, SurfaceType, UpdateCourtDTO } from '@/types/court';
import { SPORT_LABELS, SURFACE_LABELS } from '@/types/court';
import { useEffect, useState } from 'react';
import styles from './CourtFormModal.module.scss';

type CourtFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  court?: Court;
  clubs: Club[];
};

export default function CourtFormModal({ isOpen, onClose, court, clubs }: CourtFormModalProps) {
  const dispatch = useAppDispatch();
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
  }, [court, clubs, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (court) {
        const data: UpdateCourtDTO = {
          name,
          sport,
          surface_type: surfaceType,
          price_60: parseFloat(price60),
          price_90: parseFloat(price90),
          price_120: parseFloat(price120),
          min_unit_min: parseInt(minUnit),
          image_url: imageUrl,
          description,
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
          image_url: imageUrl,
          description,
          is_indoor: isIndoor
        };
        await dispatch(createCourt(data)).unwrap();
      }
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la pista';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{court ? 'Editar pista' : 'Nueva pista'}</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>
        {formError && <p className={styles.errorMsg}>{formError}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-name">
              Nombre
            </label>
            <input
              id="court-name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          {!court && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="court-club">
                Club
              </label>
              <select
                id="court-club"
                className={styles.input}
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

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-sport">
              Deporte
            </label>
            <select
              id="court-sport"
              className={styles.input}
              value={sport}
              onChange={(event) => setSport(event.target.value as Sport)}
            >
              {Object.entries(SPORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-surface">
              Superficie
            </label>
            <select
              id="court-surface"
              className={styles.input}
              value={surfaceType}
              onChange={(event) => setSurfaceType(event.target.value as SurfaceType)}
            >
              {Object.entries(SURFACE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-indoor">
              Tipo de pista
            </label>
            <select
              id="court-indoor"
              className={styles.input}
              value={isIndoor ? 'true' : 'false'}
              onChange={(event) => setIsIndoor(event.target.value === 'true')}
            >
              <option value="false">Exterior</option>
              <option value="true">Cubierta</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-price-60">
              Precio 60 min €
            </label>
            <input
              id="court-price-60"
              className={styles.input}
              type="number"
              step="0.01"
              value={price60}
              onChange={(event) => setPrice60(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-price-90">
              Precio 90 min €
            </label>
            <input
              id="court-price-90"
              className={styles.input}
              type="number"
              step="0.01"
              value={price90}
              onChange={(event) => setPrice90(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-price-120">
              Precio 120 min €
            </label>
            <input
              id="court-price-120"
              className={styles.input}
              type="number"
              step="0.01"
              value={price120}
              onChange={(event) => setPrice120(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-min-unit">
              Unidad mínima
            </label>
            <select
              id="court-min-unit"
              className={styles.input}
              value={minUnit}
              onChange={(event) => setMinUnit(event.target.value)}
            >
              <option value="30">30 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-image">
              URL imagen
            </label>
            <input
              id="court-image"
              className={styles.input}
              type="text"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="court-description">
              Descripción
            </label>
            <textarea
              id="court-description"
              className={styles.textarea}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={submitting}>
              {submitting ? 'Guardando...' : court ? 'Guardar cambios' : 'Crear pista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
