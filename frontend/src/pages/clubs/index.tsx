import ClubCard from '@/components/modules/clubs/ClubCard';
import { useClubs } from '@/hooks/useClubs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

//#region DOCUMENTATION
/**
 * @page Clubs
 * Pantalla principal de clubes.
 * Permite buscar clubes y entrar al detalle de cada uno.
 *
 * Secciones:
 *   Hero       → título, texto introductorio y buscador
 *   Results    → listado de clubes filtrados usando ClubCard
 *   Status     → estados de carga, error y vacío
 *
 * Comportamiento:
 *   - Carga los clubes desde el backend al montar.
 *   - Filtra por nombre, dirección, ciudad y descripción.
 *   - Reutiliza ClubCard para mantener la UI consistente con el resto de la app.
 */
//#endregion

//#region FUNCTIONS
export default function ClubsPage() {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const { clubs, loading, error } = useClubs();

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return clubs;
    }

    return clubs.filter((club) => {
      const haystack = [club.name, club.address, club.city, club.description].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [clubs, query]);

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <p className={styles.sectionTag}>{t('clubs.page_tag')}</p>
        <h1 className={styles.title}>{t('clubs.title')}</h1>
        <p className={styles.subtitle}>{t('clubs.subtitle')}</p>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('clubs.search_placeholder')}
          className={styles.searchBox}
        />
      </section>

      {loading ? <p className={styles.status}>{t('clubs.loading')}</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {!loading && !error && filteredClubs.length === 0 ? <p>{t('clubs.empty')}</p> : null}

      {!loading && !error ? (
        <section className={styles.resultsGrid}>
          {filteredClubs.map((club) => {
            return <ClubCard key={club.id} club={club} href={`/clubs/${club.id}`} />;
          })}
        </section>
      ) : null}
    </main>
  );
}
//#endregion
