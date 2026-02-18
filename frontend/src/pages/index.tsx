import { useState} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import styles from "@/styles/pages/Home.module.scss";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courts/court?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>{t('home.title')}</h1>
            <p className={styles.heroSubtitle}>{t('home.subtitle')}</p>
            <form className={styles.searchBox} onSubmit={handleSearch}>
              <div className={styles.searchIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder={t('home.searchbar')}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.heroImage}>
            <Image 
              src="/home.webp" 
              alt="Jugadores de pádel" 
              width={400} 
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      {/* What is AllCourts Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('home.intro_title')}</h2>
          <p className={styles.aboutText}>{t('home.intro_text')}</p>
          <p className={styles.aboutText}>{t('home.intro_text2')}
          </p>  
        </div>
      </section>

      {/* Sports Section */}
      <section className={styles.popularSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('home.sports_menu_title')}</h2>
          <p className={styles.sportsSubtitle}>{t('home.sports_menu_text')}</p>
          <div className={styles.courtsGrid}>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>⚽</div>
              <h3>{t('home.football_button_title')}</h3>
              <p>{t('home.football_button_text')}</p>
            </div>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>🏀</div>
              <h3>{t('home.basketball_button_title')}</h3>
              <p>{t('home.basketball_button_text')}</p>
            </div>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>🎾</div>
              <h3>{t('home.tenis_button_title')}</h3>
              <p>{t('home.tenis_button_text')}</p>
            </div>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>🏐</div>
              <h3>{t('home.voleiball_button_title')}</h3>
              <p>{t('home.voleiball_button_text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Players Section */}
      <section className={styles.playersSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('home.players_title')}</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>{t('home.players_subtitle_1')}</h3>
              <p>{t('home.players_text_1')}</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>{t('home.players_subtitle_2')}</h3>
              <p>{t('home.players_text_2')}</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>{t('home.players_subtitle_3')}</h3>
              <p>{t('home.players_text_3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle} style={{color: 'white'}}>{t('home.feats_title')}</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⚡</div>
              <h3>{t('home.feats_subtitle_1')}</h3>
              <p>{t('home.feats_text_1')}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>💳</div>
              <h3>{t('home.feats_subtitle_2')}</h3>
              <p>{t('home.feats_text_2')}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📍</div>
              <h3>{t('home.feats_subtitle_3')}</h3>
              <p>{t('home.feats_text_3')}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🔔</div>
              <h3>{t('home.feats_subtitle_4')}</h3>
              <p>{t('home.feats_text_4')}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📊</div>
              <h3>{t('home.feats_subtitle_5')}</h3>
              <p>{t('home.feats_text_5')}</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⭐</div>
              <h3>{t('home.feats_subtitle_6')}</h3>
              <p>{t('home.feats_text_6')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Managers Section */}
      <section className={styles.managersSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('home.manager_title')}</h2>
          <p className={styles.managersText}>{t('home.manager_text')}</p>
          <Link href="/infomanager" className={styles.learnMoreBtn}>{t('home.manager_button')}</Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('home.reviews_title')}</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <h4>{t('home.review_title_1')}</h4>
              <p className={styles.testimonialAuthor}>{t('home.review_name_1')}</p>
              <p className={styles.testimonialText}>{t('home.review_text_1')}</p>
            </div>
            <div className={styles.testimonialCard}>
              <h4>{t('home.review_title_2')}</h4>
              <p className={styles.testimonialAuthor}>{t('home.review_name_2')}</p>
              <p className={styles.testimonialText}>{t('home.review_text_2')}</p>
            </div>
            <div className={styles.testimonialCard}>
              <h4>{t('home.review_title_3')}</h4>
              <p className={styles.testimonialAuthor}>{t('home.review_name_3')}</p>
              <p className={styles.testimonialText}>{t('home.review_text_3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>{t('home.cta_title')}</h2>
          <p className={styles.ctaText}>{t('home.cta_text')}</p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryBtn}>{t('home.signup_button')}</Link>
            <Link href="/courts/court" className={styles.secondaryBtn}>{t('home.explore_button')}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}