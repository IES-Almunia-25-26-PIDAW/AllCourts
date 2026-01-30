import styles from '@/styles/Infomanager.module.scss';
import Image from 'next/image';

export default function Infomanager() {
    return (
        <>
        <main className={styles.main}>
        {/* SECCIÓN HERO */}
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <h1>Gestiona tu club deportivo sin esfuerzo</h1>
                    <p>La plataforma completa para digitalizar tu negocio. Aumenta reservas, reduce trabajo manual y mejora la experiencia de tus clientes.</p>
                </div>
                <div className={styles.heroImage}>
                    <Image src="/infomanager1.webp" alt="AllCourts Logo" width={400} height={400} />
                </div>
            </div>
        </section>

        {/* SECCIÓN: BENEFICIOS CLAVE */}
        <section className={styles.benefitsSection}>
            <h2>¿Por qué elegir AllCourts?</h2>
            <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>💰</div>
                <h3>Aumenta tus ingresos</h3>
                <p>Llena más pistas con reservas online 24/7. Los clubes en nuestra plataforma aumentan sus reservas hasta un 40%.</p>
            </div>
            <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>⏱️</div>
                <h3>Ahorra tiempo</h3>
                <p>Elimina llamadas telefónicas y gestiona todas las reservas desde un panel centralizado. Automatiza tu negocio.</p>
            </div>
            <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>📊</div>
                <h3>Datos en tiempo real</h3>
                <p>Accede a estadísticas de ocupación, ingresos y clientes. Toma decisiones basadas en datos reales.</p>
            </div>
            </div>
        </section>

        {/* SECCIÓN: DASHBOARD */}
        <section className={styles.dashboardSection}>
            <div className={styles.dashboardContent}>
                <div className={styles.dashboardImage}>
                    <Image src="/logoallcourts.png" alt="Dashboard Preview" width={350} height={350} />
                </div>
                <div className={styles.dashboardText}>
                    <h2>Tu panel de control completo</h2>
                    <ul className={styles.featureList}>
                        <li>
                            <strong>📅 Calendario de reservas:</strong> Visualiza todas las reservas de tus pistas en un calendario intuitivo. Edita, cancela o crea reservas manualmente.
                        </li>
                        <li>
                            <strong>💳 Gestión de pagos:</strong> Recibe pagos automáticamente. Sistema seguro con liquidaciones semanales directas a tu cuenta.
                        </li>
                        <li>
                            <strong>👥 Base de clientes:</strong> Accede al perfil de tus clientes, historial de reservas y preferencias para ofrecerles un mejor servicio.
                        </li>
                        <li>
                            <strong>⚙️ Configuración flexible:</strong> Establece precios por horario, días de la semana o temporadas. Define tus propias reglas de cancelación.
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* SECCIÓN: PLANES Y SUSCRIPCIONES */}
        <section id='subscripcion' className={styles.pricingSection}>
            <h2>Planes que se adaptan a ti</h2>
            <p className={styles.pricingSubtitle}>Sin costes de instalación. Sin permanencia. Cancela cuando quieras.</p>
            <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
                <div className={styles.planBadge}>BÁSICO</div>
                <h3>Plan Starter</h3>
                <div className={styles.price}>
                    <span className={styles.amount}>29€</span>
                    <span className={styles.period}>/mes</span>
                </div>
                <ul className={styles.planFeatures}>
                    <li>✅ Hasta 3 pistas</li>
                    <li>✅ Reservas ilimitadas</li>
                    <li>✅ Panel de control básico</li>
                    <li>✅ Soporte por email</li>
                    <li>❌ Estadísticas avanzadas</li>
                    <li>❌ App personalizada</li>
                </ul>
                <button className={styles.planButton}>Empezar ahora</button>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.featured}`}>
                <div className={styles.planBadge}>POPULAR</div>
                <h3>Plan Professional</h3>
                <div className={styles.price}>
                    <span className={styles.amount}>79€</span>
                    <span className={styles.period}>/mes</span>
                </div>
                <ul className={styles.planFeatures}>
                    <li>✅ Hasta 10 pistas</li>
                    <li>✅ Reservas ilimitadas</li>
                    <li>✅ Panel completo + estadísticas</li>
                    <li>✅ Soporte prioritario 24/7</li>
                    <li>✅ Estadísticas avanzadas</li>
                    <li>✅ Integraciones (email, SMS)</li>
                </ul>
                <button className={styles.planButtonFeatured}>Más vendido</button>
            </div>
            
            <div className={styles.pricingCard}>
                <div className={styles.planBadge}>PREMIUM</div>
                <h3>Plan Enterprise</h3>
                <div className={styles.price}>
                    <span className={styles.amount}>199€</span>
                    <span className={styles.period}>/mes</span>
                </div>
                <ul className={styles.planFeatures}>
                    <li>✅ Pistas ilimitadas</li>
                    <li>✅ Multi-ubicación</li>
                    <li>✅ Todo lo del Professional</li>
                    <li>✅ Gestor de cuenta dedicado</li>
                    <li>✅ App personalizada</li>
                    <li>✅ API para integraciones</li>
                </ul>
                <button className={styles.planButton}>Contactar ventas</button>
            </div>
            </div>
        </section>

        {/* SECCIÓN: TESTIMONIOS */}
        <section className={styles.testimonialsSection}>
            <h2>Lo que dicen nuestros clubes</h2>
            <div className={styles.testimonialsGrid}>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>"Desde que usamos AllCourts nuestras reservas han aumentado un 35%. El sistema es muy fácil de usar y nuestros clientes están encantados."</p>
                    <div className={styles.author}>
                        <strong>Miguel Ángel P.</strong>
                        <span>Director - Club Pádel Madrid</span>
                    </div>
                </div>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>"Antes perdíamos horas al teléfono gestionando reservas. Ahora todo es automático y podemos centrarnos en mejorar nuestras instalaciones."</p>
                    <div className={styles.author}>
                        <strong>Laura S.</strong>
                        <span>Gerente - Tennis Barcelona</span>
                    </div>
                </div>
                <div className={styles.testimonialCard}>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                    <p>"Las estadísticas son increíbles. Ahora sabemos exactamente qué horarios son más demandados y ajustamos nuestros precios en consecuencia."</p>
                    <div className={styles.author}>
                        <strong>Roberto C.</strong>
                        <span>Propietario - Deportivo Sevilla</span>
                    </div>
                </div>
            </div>
        </section>

        {/* SECCIÓN: CARACTERÍSTICAS ADICIONALES */}
        <section className={styles.featuresSection}>
            <h2>Funcionalidades avanzadas</h2>
            <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
                <h3>🔔 Notificaciones automáticas</h3>
                <p>Tus clientes reciben confirmaciones y recordatorios automáticos por email. Reduce los no-shows hasta un 70%.</p>
            </div>
            <div className={styles.featureCard}>
                <h3>💵 Gestión de precios dinámica</h3>
                <p>Configura diferentes tarifas por horario, día de la semana, temporada o tipo de cliente. Maximiza tus ingresos.</p>
            </div>
            <div className={styles.featureCard}>
                <h3>📱 Responsive 100%</h3>
                <p>Tu panel funciona perfectamente en móvil, tablet y ordenador. Gestiona tu club desde cualquier lugar.</p>
            </div>
            <div className={styles.featureCard}>
                <h3>🛡️ Seguridad garantizada</h3>
                <p>Cumplimiento RGPD, pagos encriptados y backups diarios. Tus datos y los de tus clientes están seguros.</p>
            </div>
            <div className={styles.featureCard}>
                <h3>📈 Informes detallados</h3>
                <p>Exporta informes de ingresos, ocupación y clientes en Excel. Ideal para contabilidad y análisis de negocio.</p>
            </div>
            <div className={styles.featureCard}>
                <h3>⭐ Sistema de valoraciones</h3>
                <p>Los clientes pueden valorar tu club. Usa el feedback para mejorar y atrae más clientes con buenas reseñas.</p>
            </div>
            </div>
        </section>

        {/* SECCIÓN: FAQ */}
        <section className={styles.faqSection}>
            <h2>Preguntas Frecuentes</h2>
            <div className={styles.faqContainer}>
            <article className={styles.faqItem}>
                <h3>¿Cómo empiezo a usar AllCourts?</h3>
                <p>Es muy sencillo. Regístrate, configura tus pistas y horarios, y empieza a recibir reservas. Todo el proceso lleva menos de 30 minutos. Además, te ayudamos con una demo personalizada.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Qué comisión cobráis por reserva?</h3>
                <p>No cobramos comisión por reserva. Solo pagas la cuota mensual de tu plan. Sin sorpresas, sin costes ocultos.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Puedo cambiar de plan en cualquier momento?</h3>
                <p>Sí, puedes actualizar o reducir tu plan cuando quieras. Los cambios se aplican en el siguiente ciclo de facturación.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Necesito conocimientos técnicos?</h3>
                <p>Para nada. La plataforma es muy intuitiva. Si sabes usar WhatsApp o Facebook, sabrás usar AllCourts. Además, ofrecemos formación inicial gratuita.</p>
            </article>
            <article className={styles.faqItem}>
                <h3>¿Cómo recibo los pagos de las reservas?</h3>
                <p>Los pagos se procesan de forma segura en la plataforma. Hacemos transferencias semanales a tu cuenta bancaria con un informe detallado.</p>
            </article>
            </div>
        </section>

        {/* SECCIÓN: CTA */}
        <section className={styles.ctaSection}>
            <h2>¿Listo para digitalizar tu club?</h2>
            <p>Únete a cientos de clubes que ya confían en AllCourts. Prueba gratis durante 14 días.</p>
            <div className={styles.ctaButtons}>
                <button className={styles.secondaryBtn} onClick={() => document.getElementById('subscripcion')?.scrollIntoView({ behavior: 'smooth' })}>Ver Planes</button>
            </div>
        </section>
        </main>
        </>
    );
}