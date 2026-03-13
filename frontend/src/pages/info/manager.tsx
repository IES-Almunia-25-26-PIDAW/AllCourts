//#region MODULES
import styles from "./Manager.module.scss";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/dist/client/link";
//#endregion

/**
 * @page Infomanager
 * Landing informativa dirigida a gestores de clubs.
 * Presenta las ventajas de la plataforma, el dashboard, planes de
 * suscripción y FAQ para convencer al gestor de registrarse.
 *
 * Secciones:
 *   Hero          → título e imagen introductoria
 *   Benefits      → tres beneficios clave para el gestor
 *   Dashboard     → funcionalidades del panel de control
 *   Pricing       → tres planes de suscripción (29€ / 79€ / 199€)
 *   Testimonials  → reseñas de gestores reales
 *   Features      → características adicionales de la plataforma
 *   FAQ           → preguntas frecuentes
 *   CTA           → botón con scroll suave a la sección de planes
 */
export default function Infomanager() {
  //#region VARIABLES
  const { t } = useTranslation();
  //#endregion

  return (
    <>
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>{t("infomanager.introtitle")}</h1>
              <p>{t("infomanager.introtext")}</p>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="/infomanager1.webp"
                alt="AllCourts Logo"
                width={400}
                height={400}
              />
            </div>
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <h2>{t("infomanager.benefitstitle")}</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>💰</div>
              <h3>{t("infomanager.benefits1title")}</h3>
              <p>{t("infomanager.benefits1text")}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⏱️</div>
              <h3>{t("infomanager.benefits2title")}</h3>
              <p>{t("infomanager.benefits2text")}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📊</div>
              <h3>{t("infomanager.benefits3title")}</h3>
              <p>{t("infomanager.benefits3text")}</p>
            </div>
          </div>
        </section>

        <section className={styles.dashboardSection}>
          <div className={styles.dashboardContent}>
            <div className={styles.dashboardImage}>
              <Image
                src="/logoallcourts.png"
                alt="Dashboard Preview"
                width={350}
                height={350}
              />
            </div>
            <div className={styles.dashboardText}>
              <h2>{t("infomanager.dashtitle")}</h2>
              <ul className={styles.featureList}>
                <li>
                  <strong>📅 {t("infomanager.dash1title")}</strong>{" "}
                  {t("infomanager.dash1text")}
                </li>
                <li>
                  <strong>💳 {t("infomanager.dash2title")}</strong>{" "}
                  {t("infomanager.dash2text")}
                </li>
                <li>
                  <strong>👥 {t("infomanager.dash3title")}</strong>{" "}
                  {t("infomanager.dash3text")}
                </li>
                <li>
                  <strong>⚙️ {t("infomanager.dash4title")}</strong>{" "}
                  {t("infomanager.dash4text")}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="subscripcion" className={styles.pricingSection}>
          <h2>{t("infomanager.substitle")}</h2>
          <p className={styles.pricingSubtitle}>{t("infomanager.substext")}</p>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.planBadge}>
                {t("infomanager.subs1type")}
              </div>
              <h3>{t("infomanager.subs1title")}</h3>
              <div className={styles.price}>
                <span className={styles.amount}>29€</span>
                <span className={styles.period}>
                  /{t("infomanager.subsmonth")}
                </span>
              </div>
              <ul className={styles.planFeatures}>
                <li>✅ {t("infomanager.subs1charac1")}</li>
                <li>✅ {t("infomanager.subs1charac2")}</li>
                <li>✅ {t("infomanager.subs1charac3")}</li>
                <li>✅ {t("infomanager.subs1charac4")}</li>
                <li>❌ {t("infomanager.subs1charac5")}</li>
                <li>❌ {t("infomanager.subs1charac6")}</li>
              </ul>
              <Link href="/manager/login">
                <button className={styles.planButton}>
                  {t("infomanager.subs1btn")}
                </button>
              </Link>
            </div>

            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <div className={styles.planBadge}>
                {t("infomanager.subs2type")}
              </div>
              <h3>{t("infomanager.subs2title")}</h3>
              <div className={styles.price}>
                <span className={styles.amount}>79€</span>
                <span className={styles.period}>
                  /{t("infomanager.subsmonth")}
                </span>
              </div>
              <ul className={styles.planFeatures}>
                <li>✅ {t("infomanager.subs2charac1")}</li>
                <li>✅ {t("infomanager.subs2charac2")}</li>
                <li>✅ {t("infomanager.subs2charac3")}</li>
                <li>✅ {t("infomanager.subs2charac4")}</li>
                <li>✅ {t("infomanager.subs2charac5")}</li>
                <li>✅ {t("infomanager.subs2charac6")}</li>
              </ul>
              <Link href="/manager/login">
                <button className={styles.planButtonFeatured}>
                  {t("infomanager.subs2btn")}
                </button>
              </Link>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.planBadge}>
                {t("infomanager.subs3type")}
              </div>
              <h3>{t("infomanager.subs3title")}</h3>
              <div className={styles.price}>
                <span className={styles.amount}>199€</span>
                <span className={styles.period}>
                  /{t("infomanager.subsmonth")}
                </span>
              </div>
              <ul className={styles.planFeatures}>
                <li>✅ {t("infomanager.subs3charac1")}</li>
                <li>✅ {t("infomanager.subs3charac2")}</li>
                <li>✅ {t("infomanager.subs3charac3")}</li>
                <li>✅ {t("infomanager.subs3charac4")}</li>
                <li>✅ {t("infomanager.subs3charac5")}</li>
                <li>✅ {t("infomanager.subs3charac6")}</li>
              </ul>
              <Link href="/manager/login">
                <button className={styles.planButton}>
                  {t("infomanager.subs3btn")}
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.testimonialsSection}>
          <h2>{t("infomanager.testimtitle")}</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p>{t("infomanager.testim1text")}</p>
              <div className={styles.author}>
                <strong>Miguel Ángel P.</strong>
                <span>{t("infomanager.testim1job")}</span>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p>{t("infomanager.testim2text")}</p>
              <div className={styles.author}>
                <strong>Laura S.</strong>
                <span>{t("infomanager.testim2job")}</span>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p>{t("infomanager.testim3text")}</p>
              <div className={styles.author}>
                <strong>Roberto C.</strong>
                <span>{t("infomanager.testim3job")}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h2>{t("infomanager.feattitle")}</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>🔔 {t("infomanager.feat1title")}</h3>
              <p>{t("infomanager.feat1text")}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>💵 {t("infomanager.feat2title")}</h3>
              <p>{t("infomanager.feat2text")}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>📱 {t("infomanager.feat3title")}</h3>
              <p>{t("infomanager.feat3text")}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🛡️ {t("infomanager.feat4title")}</h3>
              <p>{t("infomanager.feat4text")}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>📈 {t("infomanager.feat5title")}</h3>
              <p>{t("infomanager.feat5text")}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>⭐ {t("infomanager.feat6title")}</h3>
              <p>{t("infomanager.feat6text")}</p>
            </div>
          </div>
        </section>

        <section className={styles.faqSection}>
          <h2>{t("infomanager.faqtitle")}</h2>
          <div className={styles.faqContainer}>
            <article className={styles.faqItem}>
              <h3>{t("infomanager.faq1qes")}</h3>
              <p>{t("infomanager.faq1res")}</p>
            </article>
            <article className={styles.faqItem}>
              <h3>{t("infomanager.faq2qes")}</h3>
              <p>{t("infomanager.faq2res")}</p>
            </article>
            <article className={styles.faqItem}>
              <h3>{t("infomanager.faq3qes")}</h3>
              <p>{t("infomanager.faq3res")}</p>
            </article>
            <article className={styles.faqItem}>
              <h3>{t("infomanager.faq4qes")}</h3>
              <p>{t("infomanager.faq4res")}</p>
            </article>
            <article className={styles.faqItem}>
              <h3>{t("infomanager.faq5qes")}</h3>
              <p>{t("infomanager.faq5res")}</p>
            </article>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>{t("infomanager.ctatitle")}</h2>
          <p>{t("infomanager.ctatext")}</p>
          <div className={styles.ctaButtons}>
            <button
              className={styles.secondaryBtn}
              onClick={() =>
                document
                  .getElementById("subscripcion")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("infomanager.cta1btn")}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
