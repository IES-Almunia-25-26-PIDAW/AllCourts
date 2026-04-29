import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCourtById } from "@/api/courtApi";
import { formatPrice } from "@/utils/formatters";
import BookingForm from "@/components/modules/bookings/BookingForm";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
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

      <CourtDetail court={court} />
      <BookingForm court={court} />
    </main>
  );
}
//#endregion
