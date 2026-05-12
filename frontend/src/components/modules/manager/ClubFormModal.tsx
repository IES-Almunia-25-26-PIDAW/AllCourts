import { useAppDispatch } from '@/store/hooks';
import { createClub, updateClub } from '@/store/slices/managerSlice';
import type { Club, CreateClubDTO, UpdateClubDTO } from '@/types/club';
import { useEffect, useState } from 'react';
import styles from './ClubFormModal.module.scss';

type ClubFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  club?: Club;
  managerId: string;
};

export default function ClubFormModal({ isOpen, onClose, club, managerId }: ClubFormModalProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (club) {
      setName(club.name ?? '');
      setAddress(club.address ?? '');
      setCity(club.city ?? '');
      setLogoUrl(club.logo_url ?? '');
      setDescription(club.description ?? '');
    } else {
      setName('');
      setAddress('');
      setCity('');
      setLogoUrl('');
      setDescription('');
    }
    setFormError(null);
    setSubmitting(false);
  }, [club, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (club) {
        const data: UpdateClubDTO = { name, address, city, logo_url: logoUrl, description };
        await dispatch(updateClub({ id: club.id, data })).unwrap();
      } else {
        const data: CreateClubDTO = { manager_id: managerId, name, address, city, logo_url: logoUrl, description };
        await dispatch(createClub(data)).unwrap();
      }
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el club';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{club ? 'Editar club' : 'Nuevo club'}</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>
        {formError && <p className={styles.errorMsg}>{formError}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="club-name">
              Nombre
            </label>
            <input
              id="club-name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="club-city">
              Ciudad
            </label>
            <input
              id="club-city"
              className={styles.input}
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="club-address">
              Dirección
            </label>
            <input
              id="club-address"
              className={styles.input}
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="club-logo">
              URL del logo
            </label>
            <input
              id="club-logo"
              className={styles.input}
              type="text"
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="club-description">
              Descripción
            </label>
            <textarea
              id="club-description"
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
              {submitting ? 'Guardando...' : club ? 'Guardar cambios' : 'Crear club'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
