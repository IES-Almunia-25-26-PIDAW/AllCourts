import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getClubById } from "@/api/clubApi";
import { getCourtsByClubId } from "@/api/courtApi";
import { formatPrice } from "@/utils/formatters";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
import type { ClubWithManager } from "@/types/club";
import type { CourtWithClub } from "@/types/court";
import styles from "./ClubDetail.module.scss";

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

  const coverImage = club.logo_url || "/logoallcourts.png";

  return (
    <main className={styles.page}>
      <Link href="/clubs" className={styles.backLink}>
        ← Volver a clubes
      </Link>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={coverImage}
            alt={club.name}
            fill
            className={styles.heroImageMedia}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className={styles.sectionTag}>Club</p>

          <h1 className={styles.title}>{club.name}</h1>

          <p className={styles.meta}>
            {club.city || "Ciudad no disponible"}
            {club.address ? ` · ${club.address}` : ""}
          </p>

          <p className={styles.description}>
            {club.description || "Sin descripción disponible."}
          </p>

          <div className={styles.infoCard}>
            <h2 className={styles.infoCardTitle}>Pistas del club</h2>

            <Link href="/courts/court" className={styles.allCourtsLink}>
              Ver todas las pistas
            </Link>

            {courts.length === 0 ? (
              <p className={styles.emptyState}>
                Este club todavía no tiene pistas cargadas.
              </p>
            ) : (
              <div className={styles.courtsGrid}>
                {courts.map((court) => {
                  const coverCourtImage =
                    court.image_url || "/logoallcourts.png";

                  return (
                    <article key={court.id} className={styles.courtCard}>
                      <div className={styles.courtImage}>
                        <Image
                          src={coverCourtImage}
                          alt={court.name}
                          fill
                          className={styles.courtImageMedia}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      <div className={styles.courtBody}>
                        <p className={styles.courtName}>{court.name}</p>

                        <p className={styles.courtSport}>
                          {SPORT_LABELS[court.sport]}
                        </p>

                        <p className={styles.courtSurface}>
                          {SURFACE_LABELS[court.surface_type]}
                        </p>

                        <p className={styles.courtPrice}>
                          Desde {formatPrice(Number(court.price_60))}
                        </p>

                        <Link
                          href={`/courts/${court.id}`}
                          className={styles.courtLink}
                        >
                          Ver pista
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
//#endregion
