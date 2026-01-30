import styles from '@/styles/Infoplayer.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function Infoplayer() {
    return (
        <>
        <main className={styles.main}>
        {/* SECCIÓN INTRODUCCIÓN */}
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <h1>Reserva tu pista en segundos</h1>
                    <p>Miles de pistas de pádel, tenis, fútbol y más deportes. Todo en una sola búsqueda. Encuentra, reserva y juega.</p>
                </div>
                <div className={styles.heroImage}>
                    <Image src="/infoplayer1.webp" alt="AllCourts Logo" width={400} height={400} />
                </div>
            </div>
        </section>

        {/* SECCIÓN: RESERVA INTELIGENTE */}
        <section className={styles.stepsSection}>
            <h2>Cómo reservar tu pista</h2>
            <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                    <Image src="/logoallcourts.png" alt="Paso 1: Buscar" width={80} height={80} />
                </div>
                <h3>1. Busca y filtra</h3>
                <p>Encuentra pistas por deporte, ubicación, tipo de superficie o si la pista es cubierta o exterior.</p>
            </div>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                    <Image src="/logoallcourts.png" alt="Paso 2: Horarios" width={80} height={80} />
                </div>
                <h3>2. Elige tu horario</h3>
                <p>Accede a la disponibilidad en tiempo real de todos los clubes de tu ciudad sin llamadas telefónicas.</p>
            </div>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                    <Image src="/logoallcourts.png" alt="Paso 3: Pago" width={80} height={80} />
                </div>
                <h3>3. Pago flexible</h3>
                <p>Paga la pista completa o divide el pago con tus amigos automáticamente desde la app.</p>
            </div>
            </div>
        </section>

        {/* SECCIÓN: VALORACIONES */}
        <section className={styles.testimonialsSection}>
            <h2>Lo que dicen nuestros jugadores</h2>
            <div className={styles.testimonialsGrid}>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>"Increíble lo fácil que es reservar. Ya no tengo que estar llamando a los clubes para saber si hay pistas disponibles. Todo en tiempo real."</p>
                    <div className={styles.author}>
                        <strong>Carlos M.</strong>
                        <span>Jugador de pádel</span>
                    </div>
                </div>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>"He probado varias apps y esta es la mejor. El sistema de pago es súper cómodo y puedo ver el historial de todas mis reservas."</p>
                    <div className={styles.author}>
                        <strong>María G.</strong>
                        <span>Jugadora de tenis</span>
                    </div>
                </div>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>"La interfaz es muy intuitiva. Mis padres, que no son muy de tecnología, la usan sin problemas. Y los filtros de búsqueda son perfectos."</p>
                    <div className={styles.author}>
                        <strong>Javier R.</strong>
                        <span>Jugador de fútbol</span>
                    </div>
                </div>
            </div>
        </section>

        {/* SECCIÓN: CARACTERÍSTICAS PRINCIPALES */}
        <section className={styles.profileSection}>
            <h2>Tu mejor aliado para jugar</h2>
            <div className={styles.profileGrid}>
            <div className={styles.profileCard}>
                <h3>📊 Historial completo</h3>
                <p>Accede a todas tus reservas pasadas y futuras. Consulta los clubes que has visitado y gestiona tus próximos partidos desde un solo lugar.</p>
            </div>
            <div className={styles.profileCard}>
                <h3>💳 Pago seguro y rápido</h3>
                <p>Paga con tarjeta de forma segura. Sin sorpresas, sin comisiones ocultas. El precio que ves es el precio que pagas.</p>
            </div>
            <div className={styles.profileCard}>
                <h3>⚡ Disponibilidad en tiempo real</h3>
                <p>Ve qué pistas están disponibles al instante. No más llamadas, no más esperas. Reserva y confirma en segundos.</p>
            </div>
            <div className={styles.profileCard}>
                <h3>📍 Encuentra pistas cerca</h3>
                <p>Busca por ubicación y encuentra las mejores pistas en tu zona. Filtra por deporte, tipo de superficie, pistas cubiertas y más.</p>
            </div>
            <div className={styles.profileCard}>
                <h3>🔔 Notificaciones útiles</h3>
                <p>Recibe recordatorios de tus reservas y avisos importantes del club. Nunca te pierdas un partido.</p>
            </div>
            <div className={styles.profileCard}>
                <h3>⭐ Valora tu experiencia</h3>
                <p>Comparte tu opinión sobre los clubes y ayuda a otros jugadores a elegir. Lee valoraciones de la comunidad antes de reservar.</p>
            </div>
            </div>
        </section>

        {/* SECCIÓN: FAQ JUGADORES */}
        <section className={styles.faqSection}>
            <h2>Preguntas Frecuentes</h2>
            <div className={styles.faqContainer}>
            <article className={styles.faqItem}>
                <h3>¿Cómo hago una reserva en AllCourts?</h3>
                <p>Es muy sencillo: busca el club y la pista que te interesa, selecciona el día y la hora que mejor te venga, y confirma tu reserva. Recibirás una confirmación instantánea por email.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Puedo cancelar mi reserva?</h3>
                <p>Sí, puedes cancelar tu reserva desde tu perfil. Las políticas de cancelación dependen de cada club, pero generalmente puedes cancelar sin coste hasta 24 horas antes.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Qué métodos de pago aceptáis?</h3>
                <p>Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express). El pago es 100% seguro y encriptado.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Puedo reservar para varias personas?</h3>
                <p>Sí, cuando reserves puedes indicar el número de jugadores. El precio se muestra por pista completa, independientemente del número de jugadores.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Necesito registrarme para reservar?</h3>
                <p>Sí, necesitas crear una cuenta gratuita. Esto te permite gestionar tus reservas, ver tu historial y recibir notificaciones importantes sobre tus partidos.</p>
            </article>
            </div>
        </section>

        {/* SECCIÓN: CTA */}
        <section className={styles.ctaSection}>
            <h2>¿Listo para tu próximo partido?</h2>
            <p>Únete a miles de jugadores que ya reservan sus pistas con AllCourts.</p>
            <div className={styles.ctaButtons}>
                <button className={styles.primaryBtn}>Buscar Pistas</button>
                <Link href="/login">
                <button className={styles.secondaryBtn}>Crear Cuenta Gratis</button>
                </Link>
            </div>
        </section>
        </main>
        </>
    );
}