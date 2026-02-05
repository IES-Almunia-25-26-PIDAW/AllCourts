import styles from '@/styles/Infoplayer.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Infoplayer() {
    const { t } = useTranslation();
    return (
        <>
        <main className={styles.main}>
        {/* SECCIÓN INTRODUCCIÓN */}
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <h1>{t('infoplayer.introtitle')}</h1>
                    <p>{t('infoplayer.introtext')}</p>
                </div>
                <div className={styles.heroImage}>
                    <Image src="/infoplayer1.webp" alt="AllCourts Logo" width={400} height={400} />
                </div>
            </div>
        </section>

        {/* SECCIÓN: RESERVA INTELIGENTE */}
        <section className={styles.stepsSection}>
            <h2>{t('infoplayer.booktitle')}</h2>
            <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                    <Image src="/logoallcourts.png" alt="Paso 1: Buscar" width={80} height={80} />
                </div>
                <h3>{t('infoplayer.bookstep1')}</h3>
                <p>{t('infoplayer.bookstep1text')}</p>
            </div>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                    <Image src="/logoallcourts.png" alt="Paso 2: Horarios" width={80} height={80} />
                </div>
                <h3>{t('infoplayer.bookstep2')}</h3>
                <p>{t('infoplayer.bookstep2text')}</p>
            </div>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                    <Image src="/logoallcourts.png" alt="Paso 3: Pago" width={80} height={80} />
                </div>
                <h3>{t('infoplayer.bookstep3')}</h3>
                <p>{t('infoplayer.bookstep3text')}</p>
            </div>
            </div>
        </section>

        {/* SECCIÓN: VALORACIONES */}
        <section className={styles.testimonialsSection}>
            <h2>{t('infoplayer.ratingstitle')}</h2>
            <div className={styles.testimonialsGrid}>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>{t('infoplayer.rating1text')}</p>
                    <div className={styles.author}>
                        <strong>Carlos M.</strong>
                        <span>{t('infoplayer.rating1sport')}</span>
                    </div>
                </div>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>{t('infoplayer.rating2text')}</p>
                    <div className={styles.author}>
                        <strong>María G.</strong>
                        <span>{t('infoplayer.rating2sport')}</span>
                    </div>
                </div>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>{t('infoplayer.rating3text')}</p>
                    <div className={styles.author}>
                        <strong>Javier R.</strong>
                        <span>{t('infoplayer.rating3sport')}</span>
                    </div>
                </div>
            </div>
        </section>

        {/* SECCIÓN: CARACTERÍSTICAS PRINCIPALES */}
        <section className={styles.profileSection}>
            <h2>{t('infoplayer.feattitle')}</h2>
            <div className={styles.profileGrid}>
            <div className={styles.profileCard}>
                <h3>📊 {t('infoplayer.feat1title')}</h3>
                <p>{t('infoplayer.feat1text')}</p>
            </div>
            <div className={styles.profileCard}>
                <h3>💳 {t('infoplayer.feat2title')}</h3>
                <p>{t('infoplayer.feat2text')}</p>
            </div>
            <div className={styles.profileCard}>
                <h3>⚡ {t('infoplayer.feat3title')}</h3>
                <p>{t('infoplayer.feat3text')}</p>
            </div>
            <div className={styles.profileCard}>
                <h3>📍 {t('infoplayer.feat4title')}</h3>
                <p>{t('infoplayer.feat4text')}</p>
            </div>
            <div className={styles.profileCard}>
                <h3>🔔 {t('infoplayer.feat5title')}</h3>
                <p>{t('infoplayer.feat5text')}</p>
            </div>
            <div className={styles.profileCard}>
                <h3>⭐ {t('infoplayer.feat6title')}</h3>
                <p>{t('infoplayer.feat6text')}</p>
            </div>
            </div>
        </section>

        {/* SECCIÓN: FAQ JUGADORES */}
        <section className={styles.faqSection}>
            <h2>{t('infoplayer.faqtitle')}</h2>
            <div className={styles.faqContainer}>
            <article className={styles.faqItem}>
                <h3>{t('infoplayer.faq1qes')}</h3>
                <p>{t('infoplayer.faq1res')}</p>
            </article>
            <article className={styles.faqItem}>
                <h3>{t('infoplayer.faq2qes')}</h3>
                <p>{t('infoplayer.faq2res')}</p>
            </article>
            <article className={styles.faqItem}>
                <h3>{t('infoplayer.faq3qes')}</h3>
                <p>{t('infoplayer.faq3res')}</p>
            </article>
            <article className={styles.faqItem}>
                <h3>{t('infoplayer.faq4qes')}</h3>
                <p>{t('infoplayer.faq4res')}</p>
            </article>
            <article className={styles.faqItem}>
                <h3>{t('infoplayer.faq5qes')}</h3>
                <p>{t('infoplayer.faq5res')}</p>
            </article>
            </div>
        </section>

        {/* SECCIÓN: CTA */}
        <section className={styles.ctaSection}>
            <h2>{t('infoplayer.ctatitle')}</h2>
            <p>{t('infoplayer.ctatext')}</p>
            <div className={styles.ctaButtons}>
                <button className={styles.primaryBtn}>{t('infoplayer.cta1btn')}</button>
                <Link href="/login">
                <button className={styles.secondaryBtn}>{t('infoplayer.cta2btn')}</button>
                </Link>
            </div>
        </section>
        </main>
        </>
    );
}