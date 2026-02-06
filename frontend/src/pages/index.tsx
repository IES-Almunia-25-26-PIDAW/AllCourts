import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import styles from "@/styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
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
            <h1 className={styles.heroTitle}>
              Encuentra <span className={styles.highlight}>canchas</span> y<br />
              <span className={styles.highlight}>jugadores</span> cerca de ti
            </h1>
            <p className={styles.heroSubtitle}>
              Reserva canchas deportivas en cualquier lugar.<br />
              Conecta cuando quieras, donde quieras
            </p>
            
            <form className={styles.searchBox} onSubmit={handleSearch}>
              <div className={styles.searchIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Dirección, club, ciudad..."
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
          <h2 className={styles.sectionTitle}>¿Qué es AllCourts?</h2>
          <p className={styles.aboutText}>
            AllCourts es la plataforma líder para reservar canchas deportivas y conectar con jugadores. 
            Te ayudamos a encontrar la cancha perfecta, conectar con otros deportistas y enfocarte en 
            disfrutar tu juego.
          </p>
          <p className={styles.aboutText}>
            Es el lugar donde jugadores, clubes deportivos y entrenadores se reúnen para compartir 
            la pasión por el deporte. Más que una aplicación, es una comunidad construida alrededor 
            del amor por el juego.
          </p>  
        </div>
      </section>

      {/* Sports Section */}
      <section className={styles.popularSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Reserva para cualquier deporte</h2>
          <p className={styles.sportsSubtitle}>Encuentra la cancha perfecta para tu deporte favorito</p>
          <div className={styles.courtsGrid}>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>⚽</div>
              <h3>Fútbol</h3>
              <p>Canchas 5, 7 y 11</p>
            </div>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>🏀</div>
              <h3>Baloncesto</h3>
              <p>Pistas cubiertas y al aire libre</p>
            </div>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>🎾</div>
              <h3>Tenis y Pádel</h3>
              <p>Individuales y dobles</p>
            </div>
            <div className={styles.courtCard}>
              <div className={styles.courtImage}>🏐</div>
              <h3>Voleibol</h3>
              <p>Indoor y playa</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Players Section */}
      <section className={styles.playersSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>AllCourts para jugadores</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Encuentra</h3>
              <p>
                Descubre canchas deportivas cerca de ti, revisa disponibilidad en tiempo real 
                y encuentra el lugar perfecto para tu próximo partido.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Reserva</h3>
              <p>
                Reserva tu cancha en segundos con nuestro sistema fácil e intuitivo. 
                Paga de forma segura y recibe confirmación instantánea.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Únete a la comunidad</h3>
              <p>
                Conecta con otros jugadores, únete a partidos abiertos y sé parte de 
                la comunidad deportiva más grande y activa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle} style={{color: 'white'}}>¿Por qué elegir AllCourts?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⚡</div>
              <h3>Reserva instantánea</h3>
              <p>Reserva tu cancha en segundos. Sin llamadas, sin esperas. Confirmación inmediata.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>💳</div>
              <h3>Pago seguro</h3>
              <p>Métodos de pago seguros y confiables. Tus datos siempre protegidos.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📍</div>
              <h3>Canchas cercanas</h3>
              <p>Encuentra fácilmente canchas cerca de tu ubicación con disponibilidad en tiempo real.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🔔</div>
              <h3>Notificaciones</h3>
              <p>Recibe recordatorios de tus reservas y ofertas exclusivas de tus clubes favoritos.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📊</div>
              <h3>Historial completo</h3>
              <p>Consulta todas tus reservas anteriores y gestiona las próximas desde un solo lugar.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⭐</div>
              <h3>Valoraciones reales</h3>
              <p>Lee opiniones de otros jugadores y ayuda a la comunidad con tus reseñas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Managers Section */}
      <section className={styles.managersSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>AllCourts para gestores</h2>
          <p className={styles.managersText}>
            Gestiona tu club deportivo desde un solo lugar. Recibe reservas online, 
            administra tus clientes, crea actividades y aumenta la ocupación de tus canchas.
          </p>
          <Link href="/infomanager" className={styles.learnMoreBtn}>
            Más información
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Testimonios que inspiran</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <h4>¡La mejor app!</h4>
              <p className={styles.testimonialAuthor}>Carlos M.</p>
              <p className={styles.testimonialText}>
                "Con AllCourts tengo una gran selección de canchas y es súper fácil reservar, 
                solo tres pasos y puedo hacerlo en cualquier momento"
              </p>
            </div>
            <div className={styles.testimonialCard}>
              <h4>¡Increíble!</h4>
              <p className={styles.testimonialAuthor}>Laura G.</p>
              <p className={styles.testimonialText}>
                "Ha sido mi mejor descubrimiento. Es rápido y el pago es seguro. 
                ¡Me encanta encontrar canchas disponibles en mi zona!"
              </p>
            </div>
            <div className={styles.testimonialCard}>
              <h4>¡Rápido y fácil!</h4>
              <p className={styles.testimonialAuthor}>Miguel A.</p>
              <p className={styles.testimonialText}>
                "Una app para encontrar y reservar canchas disponibles cerca en cualquier momento. 
                Imprescindible para equipos y jugadores. ¡Muy recomendable!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿Listo para jugar?</h2>
          <p className={styles.ctaText}>
            Únete a miles de jugadores que ya disfrutan de AllCourts
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryBtn}>
              Registrarse gratis
            </Link>
            <Link href="/courts/court" className={styles.secondaryBtn}>
              Explorar canchas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
