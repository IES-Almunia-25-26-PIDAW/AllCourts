import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.scss";

type CheckoutFormProps = {
	returnUrl: string;
};

/**
 * @component CheckoutForm
 * Formulario de Stripe Elements para confirmar el pago de una reserva.
 *
 * @param returnUrl URL a la que Stripe debe redirigir tras confirmar el pago.
 */
export default function CheckoutForm({ returnUrl }: CheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!stripe || !elements) return;

		setIsLoading(true);
		setErrorMessage(null);

		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: returnUrl,
				},
			});

			if (error) {
				setErrorMessage(
					error.message ?? "Ha ocurrido un error al procesar el pago.",
				);
			}
		} catch {
			setErrorMessage("Error inesperado. Por favor, inténtalo de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.stripeForm}>
			<PaymentElement className={styles.paymentElement} />

			{errorMessage ? (
				<div className={styles.errorMessage} role="alert">
					{errorMessage}
				</div>
			) : null}

			<button
				type="submit"
				disabled={!stripe || !elements || isLoading}
				className={styles.payButton}
			>
				{isLoading ? (
					<span className={styles.spinner} aria-hidden="true" />
				) : null}
				{isLoading ? "Procesando..." : "Pagar ahora"}
			</button>

			<p className={styles.securityNote}>
				🔒 Pago seguro con Stripe. Tus datos bancarios nunca llegan a nuestros servidores.
			</p>
		</form>
	);
}
