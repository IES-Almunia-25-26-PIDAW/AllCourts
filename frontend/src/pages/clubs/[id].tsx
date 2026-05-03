import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ClubCard from "@/components/modules/clubs/ClubCard";
import CourtCard from "@/components/modules/courts/CourtCard";
import { getClubById } from "@/api/clubApi";
import { getCourtsByClubId } from "@/api/courtApi";
import type { ClubWithManager } from "@/types/club";
import type { CourtWithClub } from "@/types/court";
import styles from "./[id].module.scss";

//#region DOCUMENTATION
/**
 * @page ClubDetail
 * Vista de detalle de un club.
 * Muestra la información principal del club, un resumen de sus pistas y acceso de vuelta al listado.
 *
 * Secciones:
 *   Hero       → imagen principal, nombre, ciudad y descripción
 *   CourtsCard  → listado de pistas relacionadas con acceso a su detalle
 *   BackLink    → navegación de retorno al listado de clubes
 */
//#endregion

//#region FUNCTIONS
export default function ClubDetailPage() {
  const router = useRouter();
  const [club, setClub] = useState<ClubWithManager | null>(null);
  const [courts, setCourts] = useState<CourtWithClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clubId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  useEffect(() => {
    if (!router.isReady || !clubId) {
      return;
    }

    // Cargamos el club y sus pistas a la vez para mantener la vista sincronizada.
    const loadClub = async () => {
      try {
        setLoading(true);
        setError(null);

        const [clubData, courtsData] = await Promise.all([
          getClubById(clubId),
          getCourtsByClubId(clubId),
        ]);

        setClub(clubData);
        setCourts(courtsData);
      } catch (err) {
        setClub(null);
        setCourts([]);
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el club.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadClub();
  }, [router.isReady, clubId]);

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>Cargando club...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.errorText}>{error}</p>
        <Link href="/clubs" className={styles.backLink}>
          Volver al listado
        </Link>
      </main>
    );
  }

  if (!club) {
    return (
      <main className={styles.page}>
        <p>No se encontró el club.</p>
        <Link href="/clubs" className={styles.backLink}>
          Volver al listado
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link href="/clubs" className={styles.backLink}>
        ← Volver a clubes
      </Link>

      <section className={styles.detailSection}>
        <ClubCard club={club} courtCount={courts.length} variant="detail" />
      </section>

      <section className={styles.infoCard}>
        <h2 className={styles.infoCardTitle}>Pistas del club</h2>

        <Link href="/courts" className={styles.allCourtsLink}>
          Ver todas las pistas
        </Link>

        {courts.length === 0 ? (
          <p className={styles.emptyState}>
            Este club todavía no tiene pistas cargadas.
          </p>
        ) : (
          <div className={styles.courtsGrid}>
            {courts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
//#endregion
