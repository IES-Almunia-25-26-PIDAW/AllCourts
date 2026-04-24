import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCourtById } from "@/api/courtApi";
<<<<<<< Updated upstream
=======
import { formatPrice } from "@/utils/formatters";
import BookingForm from "@/components/modules/bookings/BookingForm";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
>>>>>>> Stashed changes
import type { CourtWithClub } from "@/types/court";
import CourtDetail from "@/components/modules/courts/CourtDetail";
import styles from "./[id].module.scss";

//#region DOCUMENTATION
/**
 * @page CourtDetail
 * Vista de detalle de una pista.
 * Mantiene el retorno al club de origen para respetar el flujo club -> club[id] -> court -> court[id].
 *
 * Secciones:
 *   Hero       → imagen principal, nombre, club y superficie
 *   PriceCard  → precios por duración y nota de siguiente paso
 *   BackLink   → navegación de retorno al club
 */
//#endregion

//#region FUNCTIONS
export default function CourtDetailPage() {
  const router = useRouter();
  const [court, setCourt] = useState<CourtWithClub | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courtId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  useEffect(() => {
    if (!router.isReady || !courtId) {
      return;
    }

    const loadCourt = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourtById(courtId);
        setCourt(data);
      } catch (err) {
        setCourt(null);
        setError(
          err instanceof Error ? err.message : "No se pudo cargar la pista.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCourt();
  }, [router.isReady, courtId]);

  const backHref = court?.club_id ? `/clubs/${court.club_id}` : "/clubs";

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>Cargando pista...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.errorText}>{error}</p>
        <Link href={backHref} className={styles.backLink}>
          Volver al club
        </Link>
      </main>
    );
  }

  if (!court) {
    return (
      <main className={styles.page}>
        <p>No se encontró la pista.</p>
        <Link href={backHref} className={styles.backLink}>
          Volver al club
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link href={backHref} className={styles.backLink}>
        ← Volver al club
      </Link>

<<<<<<< Updated upstream
      <CourtDetail court={court} />
=======
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={coverImage}
            alt={court.name}
            fill
            className={styles.heroImageMedia}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.sportTag}>{SPORT_LABELS[court.sport]}</p>

          <h1 className={styles.title}>{court.name}</h1>

          <p className={styles.meta}>
            {court.club_name ? court.club_name : "Club sin nombre"}
            {court.city ? ` · ${court.city}` : ""}
          </p>

          <div className={styles.chips}>
            <span className={styles.chip}>
              Superficie: {SURFACE_LABELS[court.surface_type]}
            </span>
            <span className={styles.chip}>
              Dirección: {court.address || "No disponible"}
            </span>
          </div>

          <p className={styles.description}>
            {court.description || "Sin descripción disponible."}
          </p>

          <div className={styles.priceCard}>
            <h2 className={styles.priceTitle}>Precios</h2>

            <div className={styles.priceGrid}>
              <div className={styles.priceItem}>
                <p className={styles.priceLabel}>60 min</p>
                <strong className={styles.priceValue}>
                  {formatPrice(Number(court.price_60))}
                </strong>
              </div>
              <div className={styles.priceItem}>
                <p className={styles.priceLabel}>90 min</p>
                <strong className={styles.priceValue}>
                  {formatPrice(Number(court.price_90))}
                </strong>
              </div>
              <div className={styles.priceItem}>
                <p className={styles.priceLabel}>120 min</p>
                <strong className={styles.priceValue}>
                  {formatPrice(Number(court.price_120))}
                </strong>
              </div>
            </div>

            <p className={styles.note}>
              La reserva se conectará en el siguiente paso.
            </p>
          </div>
          <BookingForm court={court} />
        </div>
      </section>
>>>>>>> Stashed changes
    </main>
  );
}
//#endregion
