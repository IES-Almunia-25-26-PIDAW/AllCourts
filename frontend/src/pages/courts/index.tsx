import { useMemo, useState } from "react";
import Link from "next/link";
import type { CourtWithClub, Sport, SurfaceType } from "@/types/court";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
import CourtCard from "@/components/modules/courts/CourtCard";
import { useCourts } from "@/hooks/useCourts";
import styles from "./index.module.scss";

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
  const [query, setQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<SurfaceType | null>(null);
  const [selectedIndoor, setSelectedIndoor] = useState<boolean | null>(null);
  const { courts, loading, error } = useCourts();

  const filteredCourts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courts.filter((court) => {
      // Text filter
      const matchesQuery = !normalizedQuery || [
        court.name,
        court.club_name,
        court.city,
        court.sport,
        court.surface_type,
      ]
        .filter(Boolean)
        .join(" ")
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
          ← Volver a clubes
        </Link>
      </div>

      <section className={styles.section}>
        <p className={styles.sectionTag}>Pistas</p>
        <h1 className={styles.title}>Encuentra tu pista</h1>
        <p className={styles.subtitle}>
          Busca por nombre, club, ciudad, deporte o superficie.
        </p>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar pistas..."
          className={styles.searchBox}
        />

        <div className={styles.filtersBlock}>
          {Object.entries(SPORT_LABELS).map(([sport, label]) => (
            <button
              key={sport}
              type="button"
              className={selectedSport === sport ? styles.chipActive : styles.chip}
              onClick={() => setSelectedSport(selectedSport === sport ? null : sport as Sport)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.filtersBlock}>
          {Object.entries(SURFACE_LABELS).map(([surface, label]) => (
            <button
              key={surface}
              type="button"
              className={selectedSurface === surface ? styles.chipActive : styles.chip}
              onClick={() => setSelectedSurface(selectedSurface === surface ? null : surface as SurfaceType)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.filtersBlock}>
          {[
            { label: 'Todos', value: null },
            { label: 'Cubierta', value: true },
            { label: 'Exterior', value: false },
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
            Limpiar filtros
          </button>
        )}
      </section>

      {loading ? <p className={styles.status}>Cargando pistas...</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {!loading && !error && filteredCourts.length === 0 ? (
        <p>No hay pistas que coincidan con la búsqueda.</p>
      ) : null}

      {!loading && !error ? (
        <section className={styles.resultsGrid}>
          {filteredCourts.map((court) => {
            return (
              <CourtCard
                key={court.id}
                court={{
                  ...court,
                  image_url: court.image_url || "/logoallcourts.png",
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
