import { useEffect, useState } from "react";
import Link from "next/link";
import { useStripe } from "@stripe/react-stripe-js";
import { useRouteQueryParam } from "@/hooks/useRouteQueryParam";
import styles from "./PaymentStatus.module.scss";

type PaymentStatusProps = {
	bookingId: string;
};

/**
 * @component PaymentStatus
 * Consulta Stripe para mostrar el estado final del PaymentIntent.
 *
 * @param bookingId Identificador de la reserva para reintentar el pago si falla.
 */
export default function PaymentStatus({ bookingId }: PaymentStatusProps) {
	const stripe = useStripe();
	const [status, setStatus] = useState<string>("loading");
	const [message, setMessage] = useState<string>("");
	const { ready, value: clientSecret } = useRouteQueryParam(
		"payment_intent_client_secret",
	);

	useEffect(() => {
		if (!stripe || !ready) return;

		if (!clientSecret) {
			setStatus("unknown");
			setMessage("No se encontró información del pago.");
			return;
		}

		void stripe
			.retrievePaymentIntent(clientSecret)
			.then(({ paymentIntent }) => {
				if (!paymentIntent) {
					setStatus("unknown");
					setMessage("No se pudo obtener el estado del pago.");
					return;
				}

				switch (paymentIntent.status) {
					case "succeeded":
						setStatus("succeeded");
						setMessage(
							"¡Pago completado con éxito! Tu reserva está confirmada.",
						);
						break;
					case "processing":
						setStatus("processing");
						setMessage(
							"Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
						);
						break;
					case "requires_payment_method":
						setStatus("failed");
						setMessage(
							"El pago no pudo procesarse. Por favor, inténtalo con otro método de pago.",
						);
						break;
					default:
						setStatus("unknown");
						setMessage("Estado del pago desconocido.");
				}
			});
	}, [stripe, ready, clientSecret]);

	if (status === "loading") {
		return (
			<div className={styles.statusContainer}>
				<span className={styles.spinner} />
				<p>Verificando el estado del pago...</p>
			</div>
		);
	}

	return (
		<div className={`${styles.statusContainer} ${styles[status]}`}>
			<div className={styles.statusIcon}>
				{status === "succeeded" && "✅"}
				{status === "processing" && "⏳"}
				{status === "failed" && "❌"}
				{status === "unknown" && "❓"}
			</div>

			<h2 className={styles.statusTitle}>
				{status === "succeeded" && "Pago completado"}
				{status === "processing" && "Pago en proceso"}
				{status === "failed" && "Pago fallido"}
				{status === "unknown" && "Estado desconocido"}
			</h2>

			<p className={styles.statusMessage}>{message}</p>

			<div className={styles.actions}>
				{status === "succeeded" ? (
					<Link href="/profile" className={styles.primaryButton}>
						Ver mis reservas
					</Link>
				) : null}
				{status === "failed" && bookingId ? (
					<Link
						href={`/booking/payment?bookingId=${bookingId}`}
						className={styles.primaryButton}
					>
						Intentar de nuevo
					</Link>
				) : null}
				<Link href="/courts" className={styles.secondaryButton}>
					Explorar pistas
				</Link>
			</div>
		</div>
	);
}
