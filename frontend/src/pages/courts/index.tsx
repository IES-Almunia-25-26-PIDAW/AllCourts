import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCourts } from "@/api/courtApi";
import type { CourtWithClub } from "@/types/court";
import CourtCard from "@/components/modules/courts/CourtCard";
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
  const [courts, setCourts] = useState<CourtWithClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadCourts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourts();
        setCourts(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las pistas.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCourts();
  }, []);

  const filteredCourts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return courts;
    }

    return courts.filter((court) => {
      const haystack = [
        court.name,
        court.club_name,
        court.city,
        court.sport,
        court.surface_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [courts, query]);

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
