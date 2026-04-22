import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCourts } from "@/api/courtApi";
import { formatPrice } from "@/utils/formatters";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
import type { CourtWithClub } from "@/types/court";
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
            const coverImage = court.image_url || "/logoallcourts.png";

            return (
              <article key={court.id} className={styles.courtCard}>
                <div className={styles.courtImage}>
                  <img
                    src={coverImage}
                    alt={court.name}
                    className={styles.courtImageMedia}
                  />

                  <div className={styles.sportBadge}>
                    {SPORT_LABELS[court.sport]}
                  </div>

                  <div className={styles.priceBadge}>
                    {formatPrice(Number(court.price_60))}
                  </div>
                </div>

                <div className={styles.courtBody}>
                  <h2 className={styles.courtName}>{court.name}</h2>

                  <p className={styles.courtClub}>
                    {court.club_name ? court.club_name : "Club sin nombre"}
                    {court.city ? ` · ${court.city}` : ""}
                  </p>

                  <p className={styles.courtSurface}>
                    {SURFACE_LABELS[court.surface_type]}
                  </p>

                  <p className={styles.courtDescription}>
                    {court.description || "Sin descripción disponible."}
                  </p>

                  <div className={styles.pricePills}>
                    <span className={styles.pricePill}>
                      60 min: {formatPrice(Number(court.price_60))}
                    </span>
                    <span className={styles.pricePill}>
                      90 min: {formatPrice(Number(court.price_90))}
                    </span>
                    <span className={styles.pricePill}>
                      120 min: {formatPrice(Number(court.price_120))}
                    </span>
                  </div>

                  <Link
                    href={`/courts/${court.id}`}
                    className={styles.detailLink}
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
//#endregion
