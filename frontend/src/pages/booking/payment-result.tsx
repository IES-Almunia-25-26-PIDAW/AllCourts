import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import styles from "./payment-result.module.scss";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

/**
 * PaymentStatus
 *
 * Este componente usa useStripe() para recuperar el estado real del PaymentIntent
 * desde Stripe. Cuando Stripe redirige al usuario aquí, añade a la URL:
 *   ?payment_intent=pi_xxx&payment_intent_client_secret=pi_xxx_secret_xxx&redirect_status=succeeded
 *
 * Usamos stripe.retrievePaymentIntent(clientSecret) para obtener el estado
 * actual y mostrárselo al usuario.
 */
function PaymentStatus({ bookingId }: { bookingId: string }) {
	const stripe = useStripe();
	const router = useRouter();
	const [status, setStatus] = useState<string>("loading");
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		if (!stripe || !router.isReady) return;

		// Stripe añade el client_secret en la URL al redirigir.
		// Lo leemos del query param para consultar el estado del PaymentIntent.
		const clientSecret = new URLSearchParams(window.location.search).get(
			"payment_intent_client_secret",
		);

		if (!clientSecret) {
			setStatus("unknown");
			setMessage("No se encontró información del pago.");
			return;
		}

		// retrievePaymentIntent() consulta a Stripe el estado actual del pago
		// usando el clientSecret de la URL. 
		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
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
	}, [stripe, router.isReady]);

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
				{status === "succeeded" && (
					<Link href="/profile" className={styles.primaryButton}>
						Ver mis reservas
					</Link>
				)}
				{status === "failed" && bookingId && (
					<Link
						href={`/booking/payment?bookingId=${bookingId}`}
						className={styles.primaryButton}
					>
						Intentar de nuevo
					</Link>
				)}
				<Link href="/courts" className={styles.secondaryButton}>
					Explorar pistas
				</Link>
			</div>
		</div>
	);
}

/**
 * Página a la que Stripe redirige tras el pago.
**/
export default function PaymentResultPage() {
	const router = useRouter();
	const bookingId = (router.query.bookingId as string) ?? "";

	return (
		<main className={styles.page}>
			<Elements stripe={stripePromise}>
				<section className={styles.card}>
					<p className={styles.eyebrow}>Estado del pago</p>
					<h1 className={styles.title}>Resultado del pago</h1>
					<PaymentStatus bookingId={bookingId} />
				</section>
			</Elements>
		</main>
	);
}
