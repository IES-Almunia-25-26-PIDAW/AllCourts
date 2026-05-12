import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSelector } from "@/store/hooks";
import { selectAuthLoading, selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";
import styles from "./index.module.scss";

const PLAN_PAYMENT_LINKS = {
    basic: "https://buy.stripe.com/test_6oU28t6VQc237GZ0SK3gk01",
    pro: "https://buy.stripe.com/test_00w8wR0xs3vx9P77h83gk02",
    enterprise: "https://buy.stripe.com/test_dRm6oJbc6gij4uNeJA3gk00",
};

type PlanKey = keyof typeof PLAN_PAYMENT_LINKS;

type Plan = {
    key: PlanKey;
    badge: string;
    title: string;
    price: string;
    features: string[];
    featured?: boolean;
    paymentLink: string;
};

/**
 * @page Subscription
 * Página de suscripción para managers con selección de plan y checkout Stripe.
 */
export default function SubscriptionPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authLoading = useSelector(selectAuthLoading);
    const [loadingPlanKey, setLoadingPlanKey] = useState<PlanKey | null>(null);
    const [pageError, setPageError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading || !router.isReady) {
            return;
        }

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
            features: [
                t("infomanager.subs1charac1"),
                t("infomanager.subs1charac2"),
                t("infomanager.subs1charac3"),
                t("infomanager.subs1charac4"),
                t("infomanager.subs1charac5"),
                t("infomanager.subs1charac6"),
            ],
            paymentLink: PLAN_PAYMENT_LINKS.basic,
        },
        {
            key: "pro",
            badge: t("infomanager.subs2type"),
            title: t("infomanager.subs2title"),
            price: "79€",
            featured: true,
            features: [
                t("infomanager.subs2charac1"),
                t("infomanager.subs2charac2"),
                t("infomanager.subs2charac3"),
                t("infomanager.subs2charac4"),
                t("infomanager.subs2charac5"),
                t("infomanager.subs2charac6"),
            ],
            paymentLink: PLAN_PAYMENT_LINKS.pro,
        },
        {
            key: "enterprise",
            badge: t("infomanager.subs3type"),
            title: t("infomanager.subs3title"),
            price: "199€",
            features: [
                t("infomanager.subs3charac1"),
                t("infomanager.subs3charac2"),
                t("infomanager.subs3charac3"),
                t("infomanager.subs3charac4"),
                t("infomanager.subs3charac5"),
                t("infomanager.subs3charac6"),
            ],
            paymentLink: PLAN_PAYMENT_LINKS.enterprise,
        },
    ];

    const handleSelectPlan = async (plan: Plan) => {
        setPageError(null);
        setLoadingPlanKey(plan.key);

        try {
            window.location.href = plan.paymentLink;
        } catch (error) {
            setPageError(
                error instanceof Error ? error.message : t("subscription.error"),
            );
        } finally {
            setLoadingPlanKey(null);
        }
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