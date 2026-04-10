import { useEffect, useMemo, useState } from "react";
import ClubCard from "@/components/modules/clubs/ClubCard";
import { getClubs } from "@/api/clubApi";
import type { ClubWithManager } from "@/types/club";
import styles from "./ClubsPage.module.scss";

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
  const [clubs, setClubs] = useState<ClubWithManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClubs();
        setClubs(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los clubes.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadClubs();
  }, []);

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return clubs;
    }

    return clubs.filter((club) => {
      const haystack = [club.name, club.address, club.city, club.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [clubs, query]);

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <p className={styles.sectionTag}>Clubes</p>
        <h1 className={styles.title}>Encuentra tu club</h1>
        <p className={styles.subtitle}>
          Busca por nombre, ciudad o descripción y entra al club para ver sus
          pistas.
        </p>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar clubes..."
          className={styles.searchBox}
        />
      </section>

      {loading ? <p className={styles.status}>Cargando clubes...</p> : null}
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {!loading && !error && filteredClubs.length === 0 ? (
        <p>No hay clubes que coincidan con la búsqueda.</p>
      ) : null}

      {!loading && !error ? (
        <section className={styles.resultsGrid}>
          {filteredClubs.map((club) => {
            return (
              <ClubCard key={club.id} club={club} href={`/clubs/${club.id}`} />
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
//#endregion
