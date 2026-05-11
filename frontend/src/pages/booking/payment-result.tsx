import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentStatus from "@/components/modules/payments/PaymentStatus";
import { useRouteQueryParam } from "@/hooks/useRouteQueryParam";
import styles from "./payment-result.module.scss";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

/**
 * @page BookingPaymentResult
 * Pantalla de resultado para mostrar el estado real del pago tras la redirección de Stripe.
 *
 * Secciones:
 *   Summary → encabezado y tarjeta contenedora
 *   Status  → detalle del estado del PaymentIntent
 */
export default function PaymentResultPage() {
	const { value: bookingId } = useRouteQueryParam("bookingId");
	const bookingIdValue = typeof bookingId === "string" ? bookingId : "";

	return (
		<main className={styles.page}>
			<Elements stripe={stripePromise}>
				<section className={styles.card}>
					<p className={styles.eyebrow}>Estado del pago</p>
					<h1 className={styles.title}>Resultado del pago</h1>
					<PaymentStatus bookingId={bookingIdValue} />
				</section>
			</Elements>
		</main>
	);
}
