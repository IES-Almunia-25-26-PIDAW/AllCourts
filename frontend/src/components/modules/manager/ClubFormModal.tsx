import { uploadClubImage } from '@/api/clubApi';
import { useAppDispatch } from '@/store/hooks';
import { createClub, updateClub } from '@/store/slices/managerSlice';
import type { Club, CreateClubDTO, UpdateClubDTO } from '@/types/club';
import { getApiUrl } from '@/utils/runtimeConfig';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ClubFormModal.module.scss';

type ClubFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  club?: Club;
  managerId: string;
};

export default function ClubFormModal({ isOpen, onClose, club, managerId }: ClubFormModalProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (club) {
      setName(club.name ?? '');
      setAddress(club.address ?? '');
      setCity(club.city ?? '');
      setLogoUrl(club.logo_url ?? '');
      setDescription(club.description ?? '');
      setPreviewUrl(
        club?.logo_url ? (club.logo_url.startsWith('http') ? club.logo_url : `${getApiUrl()}${club.logo_url}`) : null
      );
    } else {
      setName('');
      setAddress('');
      setCity('');
      setLogoUrl('');
      setDescription('');
      setPreviewUrl(null);
    }
    setFormError(null);
    setSubmitting(false);
    setImageFile(null);
  }, [club, isOpen]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      let finalLogoUrl = logoUrl;
      if (imageFile !== null) {
        setUploadingImage(true);
        try {
          const res = await uploadClubImage(imageFile);
          finalLogoUrl = res.url;
          setLogoUrl(res.url);
          setPreviewUrl(res.fullUrl);
        } finally {
          setUploadingImage(false);
        }
      }
      if (club) {
        const data: UpdateClubDTO = {
          name,
          address,
          city,
          logo_url: finalLogoUrl,
          description: description.trim() === '' ? undefined : description.trim()
        };
        await dispatch(updateClub({ id: club.id, data })).unwrap();
      } else {
        const data: CreateClubDTO = {
          manager_id: managerId,
          name,
          address,
          city,
          logo_url: finalLogoUrl,
          description: description.trim() === '' ? undefined : description.trim()
        };
        await dispatch(createClub(data)).unwrap();
      }
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('manager.club_form_error_save');
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
            <h2 className={styles.modalTitle}>
              {club ? t('manager.club_form_edit_title') : t('manager.club_form_new_title')}
            </h2>
            <p className={styles.modalSubtitle}>{t('manager.club_form_subtitle') || ''}</p>
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
                <label className={styles.label} htmlFor="club-name">
                  {t('manager.club_form_name')}
                </label>
                <input
                  id="club-name"
                  className={styles.input}
                  type="text"
                  placeholder={t('manager.club_form_name')}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <div className={styles.helperText}>{t('manager.club_form_name_help') || ''}</div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="club-city">
                  {t('manager.club_form_city')}
                </label>
                <input
                  id="club-city"
                  className={styles.input}
                  type="text"
                  placeholder={t('manager.club_form_city')}
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="club-address">
                  {t('manager.club_form_address')}
                </label>
                <input
                  id="club-address"
                  className={styles.input}
                  type="text"
                  placeholder={t('manager.club_form_address')}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="media-info">
            <div className={styles.sectionTitle} id="media-info">
              {t('manager.media') || ''}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="club-logo">
                {t('manager.club_form_logo')}
              </label>
              <input
                id="club-logo"
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
                      club?.logo_url
                        ? club.logo_url.startsWith('http')
                          ? club.logo_url
                          : `${getApiUrl()}${club.logo_url}`
                        : null
                    );
                  }
                }}
              />
              <div className={styles.helperText}>{t('manager.club_form_logo_help') || ''}</div>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="logo-preview"
                  className={styles.imagePreview}
                />
              )}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="club-description">
                {t('manager.club_form_description')}
              </label>
              <textarea
                id="club-description"
                className={styles.textarea}
                placeholder={t('manager.club_form_description')}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <div className={styles.helperText}>{t('manager.club_form_description_help') || ''}</div>
            </div>
          </section>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={submitting}>
              {t('manager.cancel')}
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={submitting || uploadingImage}>
              {submitting || uploadingImage
                ? t('manager.saving')
                : club
                  ? t('manager.club_form_save')
                  : t('manager.club_form_create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
