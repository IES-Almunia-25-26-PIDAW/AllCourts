import Link from "next/link";
import { formatPrice } from "@/utils/formatters";
import BookingForm from "@/components/modules/bookings/BookingForm";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
import CourtDetail from "@/components/modules/courts/CourtDetail";
import { useCourtDetail } from "@/hooks/useCourtDetail";
import { useRouteQueryParam } from "@/hooks/useRouteQueryParam";
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
  const { value: courtId } = useRouteQueryParam("id");
  const { court, loading, error } = useCourtDetail(typeof courtId === "string" ? courtId : undefined);

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

      <div className={styles.contentStack}>
        <CourtDetail court={court} />
        <BookingForm court={court} />
      </div>
    </main>
  );
}
//#endregion
