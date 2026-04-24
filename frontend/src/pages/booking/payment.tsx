import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  formatDurationMinutes,
  formatLongDate,
  formatPrice,
  formatTimeRange,
} from "@/utils/formatters";
import styles from "./payment.module.scss";

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default function BookingPaymentPage() {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  const isEnglish = i18n.language.startsWith("en");
  const locale = isEnglish ? "en-US" : "es-ES";
  const pendingLabel = isEnglish ? "Pending" : "Pendiente";

  const bookingId = firstValue(router.query.bookingId);
  const courtId = firstValue(router.query.courtId);
  const courtName =
    firstValue(router.query.courtName) || (isEnglish ? "Court" : "Pista");
  const clubName =
    firstValue(router.query.clubName) || t("register.option_club");
  const date = firstValue(router.query.date);
  const startTime = firstValue(router.query.startTime);
  const endTime = firstValue(router.query.endTime);
  const duration = firstValue(router.query.duration);
  const totalPrice = Number(firstValue(router.query.totalPrice) || 0);

  return (
    <main className={styles.page}>
      <Link
        href={courtId ? `/courts/${courtId}` : "/courts"}
        className={styles.backLink}
      >
        ← Volver a la pista
      </Link>

      <section className={styles.card}>
        <p className={styles.eyebrow}>Pago pendiente</p>
        <h1 className={styles.title}>Resumen de pago</h1>
        <p className={styles.subtitle}>
          Revisa los datos de tu reserva antes de continuar con el pago.
        </p>

        <div className={styles.badgeRow}>
          <span className={styles.badge}>Reserva #{bookingId || "-"}</span>
          <span className={styles.badge}>Estado: pendiente</span>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Pista</p>
            <p className={styles.summaryValue}>{courtName}</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Club</p>
            <p className={styles.summaryValue}>{clubName}</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Fecha</p>
            <p className={styles.summaryValue}>
              {formatLongDate(date, locale, pendingLabel)}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Horario</p>
            <p className={styles.summaryValue}>
              {startTime && endTime
                ? formatTimeRange(startTime, endTime)
                : "--:-- - --:--"}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Duración</p>
            <p className={styles.summaryValue}>
              {duration ? formatDurationMinutes(duration) : "--"}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Total</p>
            <p className={styles.summaryValue}>{formatPrice(totalPrice)}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
