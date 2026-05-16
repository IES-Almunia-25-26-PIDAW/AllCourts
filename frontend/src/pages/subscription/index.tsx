import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSelector } from "@/store/hooks";
import { selectAuthLoading, selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createSubscription } from "@/api/stripeApi";
import SubscriptionCheckoutForm from "@/components/modules/payments/SubscriptionCheckoutForm";
import styles from "./index.module.scss";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está definida');
}

const stripePromise = loadStripe(stripeKey);

const PLAN_PRICE_IDS = {
	basic: "price_1TWNBYQtE3XYjvG19wczmxdH",
	pro: "price_1TWNENQtE3XYjvG16dKdqhDB",
	enterprise: "price_1TWNEDQtE3XYjvG1j81qxME5",
} as const;

type PlanKey = keyof typeof PLAN_PRICE_IDS;

type Plan = {
	key: PlanKey;
	badge: string;
	title: string;
	price: string;
	priceId: string;
	features: string[];
	featured?: boolean;
};

/**
 * Estado del checkout inline.
 * - null → mostrando la cuadrícula de planes
 * - { plan, clientSecret } → mostrando el formulario de pago de Stripe
 */
type CheckoutState = {
	plan: Plan;
	clientSecret: string;
} | null;

/**
 * @page SubscriptionPage
 *
 * Muestra los tres planes de suscripción para managers.
 * Cuando el usuario hace clic en un plan:
 *   1. Llamamos a POST /stripe/create-subscription con el priceId → obtenemos clientSecret
 *   2. Inicializamos <Elements stripe={stripePromise} options={{ clientSecret }}>
 *   3. Renderizamos <SubscriptionCheckoutForm> DENTRO de la misma página (sin salir)
 *      Este componente ya existía y se usaba en otro sitio — lo reutilizamos tal cual.
 *
 * Esto es exactamente el mismo patrón que /pages/booking/payment.tsx usa para
 * las reservas: crear intent → obtener clientSecret → montar Elements inline.
 */
export default function SubscriptionPage() {
	const { t } = useTranslation();
	const router = useRouter();
	const user = useSelector(selectUser);
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const authLoading = useSelector(selectAuthLoading);

	/** Qué plan está en proceso de carga (mientras llamamos al backend) */
	const [loadingPlanKey, setLoadingPlanKey] = useState<PlanKey | null>(null);

	/** Error de red al crear la suscripción */
	const [pageError, setPageError] = useState<string | null>(null);

	/**
	 * checkout es null cuando estamos en la pantalla de selección de plan.
	 * Cuando el usuario elige un plan y el backend responde con el clientSecret,
	 * guardamos aquí el plan elegido y ese secret para montar Elements.
	 */
	const [checkout, setCheckout] = useState<CheckoutState>(null);

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
	useEffect(() => {
		if (authLoading || !router.isReady) return;
		if (!isAuthenticated || user?.role !== "manager") {
			router.replace("/login");
		}
	}, [authLoading, isAuthenticated, router, user]);

	const plans: Plan[] = [
		{
			key: "basic",
			badge: t("infomanager.subs1type"),
			title: t("infomanager.subs1title"),
			price: "29€",
			priceId: PLAN_PRICE_IDS.basic,
			features: [
				t("infomanager.subs1charac1"),
				t("infomanager.subs1charac2"),
				t("infomanager.subs1charac3"),
				t("infomanager.subs1charac4"),
				t("infomanager.subs1charac5"),
				t("infomanager.subs1charac6"),
			],
		},
		{
			key: "pro",
			badge: t("infomanager.subs2type"),
			title: t("infomanager.subs2title"),
			price: "79€",
			featured: true,
			priceId: PLAN_PRICE_IDS.pro,
			features: [
				t("infomanager.subs2charac1"),
				t("infomanager.subs2charac2"),
				t("infomanager.subs2charac3"),
				t("infomanager.subs2charac4"),
				t("infomanager.subs2charac5"),
				t("infomanager.subs2charac6"),
			],
		},
		{
			key: "enterprise",
			badge: t("infomanager.subs3type"),
			title: t("infomanager.subs3title"),
			price: "199€",
			priceId: PLAN_PRICE_IDS.enterprise,
			features: [
				t("infomanager.subs3charac1"),
				t("infomanager.subs3charac2"),
				t("infomanager.subs3charac3"),
				t("infomanager.subs3charac4"),
				t("infomanager.subs3charac5"),
				t("infomanager.subs3charac6"),
			],
		},
	];

	const handleSelectPlan = async (plan: Plan) => {
		setPageError(null);
		setLoadingPlanKey(plan.key);

		try {
			const { clientSecret } = await createSubscription(plan.priceId);
			setCheckout({ plan, clientSecret });
		} catch (error) {
			setPageError(
				error instanceof Error ? error.message : t("subscription.error"),
			);
		} finally {
			setLoadingPlanKey(null);
		}
	};

	const handleBack = () => {
		setCheckout(null);
		setPageError(null);
	};

	if (authLoading || !router.isReady) {
		return (
			<main className={styles.container}>
				<div className={styles.loadingState}>Cargando...</div>
			</main>
		);
	}

	if (!isAuthenticated || user?.role !== "manager") {
		return null;
	}

	if (checkout) {
		return (
			<main className={styles.container}>
				<header className={styles.header}>
					<p className={styles.eyebrow}>{t("subscription.selectPlan")}</p>
					<h1>{t("subscription.choosePlan")}</h1>
				</header>

				<div className={styles.checkoutWrapper}>
					<div className={styles.subscriptionSummary}>
						<p className={styles.summaryLabel}>{checkout.plan.badge}</p>
						<h2>{checkout.plan.title}</h2>
						<p className={styles.summaryPrice}>
							{checkout.plan.price}{" "}
							<span>/{t("subscription.monthly")}</span>
						</p>
						<p className={styles.subscriptionMeta}>
							🔒 {t("subscription.securePayment")}
						</p>
					</div>

					{pageError ? (
						<div className={styles.errorMessage} role="alert">
							{pageError}
						</div>
					) : null}

					<Elements
						stripe={stripePromise}
						options={{
							clientSecret: checkout.clientSecret,
							appearance: stripeAppearance,
						}}
					>
						<SubscriptionCheckoutForm onBack={handleBack} />
					</Elements>
				</div>
			</main>
		);
	}
	return (
		<main className={styles.container}>
			<header className={styles.header}>
				<p className={styles.eyebrow}>{t("subscription.selectPlan")}</p>
				<h1>{t("subscription.choosePlan")}</h1>
				<p>{t("infomanager.substext")}</p>
			</header>

			{pageError ? (
				<div className={styles.errorMessage} role="alert">
					{pageError}
				</div>
			) : null}

			<section>
				<div className={styles.plansGrid}>
					{plans.map((plan) => (
						<article key={plan.key} className={styles.planCard}>
							<div className={styles.planCardHeader}>
								<span className={styles.planBadge}>{plan.badge}</span>
								{plan.featured ? (
									<span className={styles.featuredTag}>Most popular</span>
								) : null}
							</div>
							<h2 className={styles.planTitle}>{plan.title}</h2>
							<p className={styles.planCard__price}>
								{plan.price} <span>/{t("subscription.monthly")}</span>
							</p>
							<ul className={styles.planCard__features}>
								{plan.features.map((feature) => (
									<li key={feature}>{feature}</li>
								))}
							</ul>
							<button
								type="button"
								className={styles.selectBtn}
								onClick={() => handleSelectPlan(plan)}
								disabled={loadingPlanKey !== null}
							>
								{loadingPlanKey === plan.key
									? t("subscription.processing")
									: t("subscription.payNow")}
							</button>
						</article>
					))}
				</div>
			</section>
		</main>
	);
}
