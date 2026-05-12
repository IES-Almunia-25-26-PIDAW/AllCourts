import { useState } from "react";
import { useRouter } from "next/router";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { getSubscriptionStatus } from "@/api/stripeApi";
import styles from "./SubscriptionCheckoutForm.module.scss";

type SubscriptionCheckoutFormProps = {
	onBack: () => void;
};

export default function SubscriptionCheckoutForm({ onBack }: SubscriptionCheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setIsSubmitting(true);
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			const confirmationResult = await stripe.confirmPayment({
				elements,
				redirect: "if_required",
				confirmParams: {
					return_url:
						typeof window !== "undefined"
							? `${window.location.origin}/manager`
							: "/manager",
				},
			});

			if ("error" in confirmationResult && confirmationResult.error) {
				setErrorMessage(
					confirmationResult.error.message ?? t("subscription.error"),
				);
				return;
			}

			if (
				"paymentIntent" in confirmationResult &&
				confirmationResult.paymentIntent?.status === "succeeded"
			) {
				try {
					await getSubscriptionStatus();
				} catch {
				}

				setSuccessMessage(t("subscription.success"));
				await router.push("/manager");
				return;
			}

			setSuccessMessage(t("subscription.processing"));
		} catch {
			setErrorMessage(t("subscription.error"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className={styles.checkoutForm} onSubmit={handleSubmit}>
			<div className={styles.checkoutHeader}>
				<h2>{t("subscription.payNow")}</h2>
				<button type="button" className={styles.backBtn} onClick={onBack}>
					{t("subscription.back")}
				</button>
			</div>

			<PaymentElement className={styles.paymentElement} />

			{errorMessage ? (
				<p className={styles.errorMessage} role="alert">
					{errorMessage}
				</p>
			) : null}

			{successMessage ? (
				<p className={styles.successMessage} role="status">
					{successMessage}
				</p>
			) : null}

			<button
				type="submit"
				disabled={!stripe || !elements || isSubmitting}
				className={styles.payNowBtn}
			>
				{isSubmitting ? t("subscription.processing") : t("subscription.payNow")}
			</button>
		</form>
	);
}