import CourtCard from '@/components/modules/courts/CourtCard';
import { useCourts } from '@/hooks/useCourts';
import type { Sport, SurfaceType } from '@/types/court';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

//#region DOCUMENTATION
/**
 * @page Courts
 * Listado general de pistas.
 * Sirve como vista de exploración una vez el usuario entra desde un club.
 *
 * Secciones:
 *   Hero       → título, texto introductorio y buscador
 *   Results    → listado de pistas filtradas con tarjeta propia
 *   Status     → estados de carga, error y vacío
 *
 * Comportamiento:
 *   - Carga todas las pistas desde el backend al montar.
 *   - Filtra por nombre, club, ciudad, deporte y superficie.
 *   - Muestra una tarjeta resumida con precio, superficie y acceso al detalle.
 */
//#endregion

//#region FUNCTIONS
export default function CourtPage() {
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<SurfaceType | null>(null);
  const [selectedIndoor, setSelectedIndoor] = useState<boolean | null>(null);
  const { t } = useTranslation();
  const { courts, loading, error } = useCourts();

  const translatedSportLabels: Record<Sport, string> = {
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

  const translatedSurfaceLabels: Record<SurfaceType, string> = {
    tierra_batida: t('courts.surface_tierra_batida'),
    cesped_natural: t('courts.surface_cesped_natural'),
    cesped_artificial: t('courts.surface_cesped_artificial'),
    dura: t('courts.surface_dura'),
    arena: t('courts.surface_arena'),
    parque: t('courts.surface_parque')
  };

  const filteredCourts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courts.filter((court) => {
      // Text filter
      const matchesQuery =
        !normalizedQuery ||
        [court.name, court.club_name, court.city, court.sport, court.surface_type]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      // Sport filter
      const matchesSport = selectedSport === null || court.sport === selectedSport;

      // Surface filter
      const matchesSurface = selectedSurface === null || court.surface_type === selectedSurface;

      // Indoor/outdoor filter
      const courtIsIndoor = Boolean(court.is_indoor);
      const matchesIndoor = selectedIndoor === null || courtIsIndoor === selectedIndoor;

      return matchesQuery && matchesSport && matchesSurface && matchesIndoor;
    });
  }, [courts, query, selectedSport, selectedSurface, selectedIndoor]);

  return (
    <main className={styles.page}>
      <div className={styles.backWrap}>
        <Link href="/clubs" className={styles.backLink}>
          {t('courts.back_to_clubs')}
        </Link>
      </div>

      <section className={styles.section}>
        <p className={styles.sectionTag}>{t('courts.page_tag')}</p>
        <h1 className={styles.title}>{t('courts.title')}</h1>
        <p className={styles.subtitle}>{t('courts.subtitle')}</p>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('courts.search_placeholder')}
          className={styles.searchBox}
        />

        <div className={styles.filtersBlock}>
          {Object.entries(translatedSportLabels).map(([sport, label]) => (
            <button
              key={sport}
              type="button"
              className={selectedSport === sport ? styles.chipActive : styles.chip}
              onClick={() => setSelectedSport(selectedSport === sport ? null : (sport as Sport))}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.filtersBlock}>
          {Object.entries(translatedSurfaceLabels).map(([surface, label]) => (
            <button
              key={surface}
              type="button"
              className={selectedSurface === surface ? styles.chipActive : styles.chip}
              onClick={() => setSelectedSurface(selectedSurface === surface ? null : (surface as SurfaceType))}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.filtersBlock}>
          {[
            { label: t('courts.all'), value: null },
            { label: t('courts.covered'), value: true },
            { label: t('courts.outdoor'), value: false }
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              className={selectedIndoor === option.value ? styles.chipActive : styles.chip}
              onClick={() => setSelectedIndoor(selectedIndoor === option.value ? null : option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {(query !== '' || selectedSport !== null || selectedSurface !== null || selectedIndoor !== null) && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setQuery('');
              setSelectedSport(null);
              setSelectedSurface(null);
              setSelectedIndoor(null);
            }}
          >
            {t('courts.clear_filters')}
          </button>
        )}
      </section>

      {loading ? <p className={styles.status}>{t('courts.loading')}</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {!loading && !error && filteredCourts.length === 0 ? <p>{t('courts.no_results')}</p> : null}

      {!loading && !error ? (
        <section className={styles.resultsGrid}>
          {filteredCourts.map((court) => {
            return (
              <CourtCard
                key={court.id}
                court={{
                  ...court,
                  image_url: court.image_url || '/logoallcourts.png'
                }}
              />
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
//#endregion
