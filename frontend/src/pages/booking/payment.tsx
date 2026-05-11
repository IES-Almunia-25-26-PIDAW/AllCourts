import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { formatDurationMinutes, formatLongDate, formatPrice, formatTimeRange } from "@/utils/formatters";
import { request } from "@/api/http";
import CheckoutForm from "@/components/modules/payments/CheckoutForm";
import styles from "./payment.module.scss";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function firstValue(value: string | string[] | undefined): string {
	if (Array.isArray(value)) return value[0] ?? "";
	return value ?? "";
}

interface PaymentIntentResponse {
	clientSecret: string;
	paymentIntentId: string;
	amount: number;
}

/**
 * @page BookingPayment
 * Pantalla de checkout para completar el pago de una reserva pendiente.
 *
 * Secciones:
 *   Summary     → datos de la reserva antes de pagar
 *   PaymentForm → formulario de Stripe para confirmar el pago
 *   Status      → estados de carga y error del intent
 */
/**
 * @returns {JSX.Element} Página de pago.
 */
export default function BookingPaymentPage() {
	const router = useRouter();

	const bookingId = firstValue(router.query.bookingId);
	const courtId = firstValue(router.query.courtId);
	const courtName = firstValue(router.query.courtName) || "Pista";
	const clubName = firstValue(router.query.clubName) || "Club";
	const date = firstValue(router.query.date);
	const startTime = firstValue(router.query.startTime);
	const endTime = firstValue(router.query.endTime);
	const duration = firstValue(router.query.duration);
	const totalPrice = Number(firstValue(router.query.totalPrice) || 0);

	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [loadingIntent, setLoadingIntent] = useState(false);
	const [intentError, setIntentError] = useState<string | null>(null);

	const returnUrl =
		typeof window !== "undefined"
			? `${window.location.origin}/booking/payment-result?bookingId=${bookingId}`
			: "";

	useEffect(() => {
		if (!bookingId || !router.isReady) return;

		const fetchPaymentIntent = async () => {
			setLoadingIntent(true);
			setIntentError(null);
			try {
				const data = await request<PaymentIntentResponse>(
					"/stripe/create-payment-intent",
					{
						method: "POST",
						body: JSON.stringify({ bookingId }),
					},
				);
				setClientSecret(data.clientSecret);
			} catch (err) {
				setIntentError(
					err instanceof Error
						? err.message
						: "Error al inicializar el pago. Inténtalo de nuevo.",
				);
			} finally {
				setLoadingIntent(false);
			}
		};

		fetchPaymentIntent();
	}, [bookingId, router.isReady]);

	const stripeAppearance = {
		theme: "stripe" as const,
		variables: {
			colorPrimary: "#0059ff",
			colorBackground: "#ffffff",
			colorText: "#1d2939",
			colorDanger: "#ef4444",
			fontFamily: "system-ui, sans-serif",
			borderRadius: "12px",
		},
	};

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
					Revisa los datos de tu reserva antes de continuar con el
					pago.
				</p>

				<div className={styles.badgeRow}>
					<span className={styles.badge}>
						Reserva #{bookingId || "-"}
					</span>
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
							{formatLongDate(date, "es-ES", "Pendiente")}
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
						<p
							className={`${styles.summaryValue} ${styles.totalPrice}`}
						>
							{formatPrice(totalPrice)}
						</p>
					</div>
				</div>

				<div className={styles.paymentSection}>
					<h2 className={styles.paymentTitle}>Método de pago</h2>

					{loadingIntent && (
						<div className={styles.loadingContainer}>
							<span className={styles.spinner} />
							<p>Preparando el formulario de pago...</p>
						</div>
					)}

					{intentError && (
						<div className={styles.errorMessage} role="alert">
							<strong>Error:</strong> {intentError}
						</div>
					)}

					{clientSecret && (
						<Elements
							stripe={stripePromise}
							options={{
								clientSecret,
								appearance: stripeAppearance,
							}}
						>
							<CheckoutForm returnUrl={returnUrl} />
						</Elements>
					)}
				</div>
			</section>
		</main>
	);
}
