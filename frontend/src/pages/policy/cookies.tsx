    import styles from './Cookies.module.scss';

    export default function CookiesPolicy() {
    return (
        <div className={styles.main}>
        <section className={styles.hero}>
            <div className={styles.heroInner}>
            <h1>
                Política de <span>Cookies</span>
            </h1>
            <p>
                Te explicamos qué cookies usamos, para qué sirve cada una y cómo puedes gestionarlas o desactivarlas fácilmente.
            </p>
            <div className={styles.heroMeta}>
                <span>Actualizado: enero 2025</span>
                <span>LSSI-CE · RGPD</span>
            </div>
            </div>
        </section>

        <div className={styles.pageWrap}>
            <section className={styles.section}>
            <h2>¿Qué son las cookies?</h2>
            <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador cuando los visitas. Sirven para que el sitio funcione correctamente, recuerde tus preferencias y nos ayude a entender cómo se usa la plataforma.
            </p>
            <p>
                Las cookies <strong>no</strong> contienen virus, <strong>no</strong> acceden a la información de tu disco duro y <strong>no</strong> recopilan más datos de los que indicas expresamente.
            </p>
            <div className={styles.highlightBox}>
                <p>
                <strong>Consentimiento:</strong> Al continuar navegando, aceptas las cookies técnicas necesarias para el funcionamiento del sitio. Para el resto, te pediremos tu consentimiento explícito a través del banner de cookies.
                </p>
            </div>
            </section>

            <section className={styles.section}>
            <h2>Tipos de cookies</h2>
            <h3>Por duración</h3>
            <div className={styles.cookieTypes}>
                <div className={styles.cookieCard}>
                <div className={styles.icon}>⚡</div>
                <h3>De sesión</h3>
                <p>Temporales. Se eliminan automáticamente al cerrar el navegador.</p>
                </div>
                <div className={styles.cookieCard}>
                <div className={styles.icon}>💾</div>
                <h3>Persistentes</h3>
                <p>Permanecen en tu dispositivo un tiempo determinado para recordar tus preferencias.</p>
                </div>
            </div>
            <h3>Por origen</h3>
            <div className={styles.cookieTypes}>
                <div className={styles.cookieCard}>
                <div className={styles.icon}>🏠</div>
                <h3>Propias</h3>
                <p>Creadas y gestionadas directamente por nuestra plataforma.</p>
                </div>
                <div className={styles.cookieCard}>
                <div className={styles.icon}>🌐</div>
                <h3>De terceros</h3>
                <p>Instaladas por proveedores externos como Google o Meta.</p>
                </div>
            </div>
            </section>

            <section className={styles.section}>
            <h2>Para qué las usamos</h2>
            <div className={styles.purposesGrid}>
                <div className={styles.purposeCard}>
                <div className={styles.icon}>🔧</div>
                <h3>Técnicas / Esenciales</h3>
                <p>
                    Permiten la navegación y funciones básicas: iniciar sesión, hacer reservas. Sin ellas el servicio no funciona. No requieren consentimiento.
                </p>
                </div>
                <div className={styles.purposeCard}>
                <div className={styles.icon}>📊</div>
                <h3>Analítica</h3>
                <p>Recogen datos anónimos sobre cómo se usa la plataforma. Nos ayudan a detectar errores y mejorar la experiencia.</p>
                </div>
                <div className={styles.purposeCard}>
                <div className={styles.icon}>⚙️</div>
                <h3>Funcionalidad</h3>
                <p>Recuerdan tus preferencias: idioma, región, configuración de interfaz.</p>
                </div>
                <div className={styles.purposeCard}>
                <div className={styles.icon}>📣</div>
                <h3>Marketing</h3>
                <p>Permiten mostrarte contenido relevante y medir la eficacia de nuestras campañas.</p>
                </div>
            </div>
            </section>

            <section className={styles.section}>
            <h2>Cookies que utilizamos</h2>

            <h3>Cookies propias</h3>
            <div className={styles.tableWrap}>
                <table>
                <thead>
                    <tr>
                    <th>Cookie</th>
                    <th>Duración</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>
                        <code>session_id</code>
                    </td>
                    <td>Sesión</td>
                    <td>
                        <span className={styles.badgeRequired}>Esencial</span>
                    </td>
                    <td>Mantiene la sesión del usuario activa durante la navegación.</td>
                    </tr>
                    <tr>
                    <td>
                        <code>csrf_token</code>
                    </td>
                    <td>Sesión</td>
                    <td>
                        <span className={styles.badgeRequired}>Esencial</span>
                    </td>
                    <td>Protege contra ataques de tipo CSRF.</td>
                    </tr>
                    <tr>
                    <td>
                        <code>user_prefs</code>
                    </td>
                    <td>1 año</td>
                    <td>
                        <span className={styles.badgeOptional}>Funcionalidad</span>
                    </td>
                    <td>Guarda el idioma, deporte favorito y zona geográfica del usuario.</td>
                    </tr>
                    <tr>
                    <td>
                        <code>cookie_consent</code>
                    </td>
                    <td>1 año</td>
                    <td>
                        <span className={styles.badgeRequired}>Esencial</span>
                    </td>
                    <td>Almacena las preferencias de consentimiento sobre cookies.</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <h3>Cookies de analítica (Google Analytics)</h3>
            <div className={styles.tableWrap}>
                <table>
                <thead>
                    <tr>
                    <th>Cookie</th>
                    <th>Duración</th>
                    <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>
                        <code>_ga</code>
                    </td>
                    <td>2 años</td>
                    <td>Identifica de forma anónima a los visitantes para distinguir sesiones únicas.</td>
                    </tr>
                    <tr>
                    <td>
                        <code>_gid</code>
                    </td>
                    <td>24 horas</td>
                    <td>Identifica la sesión actual del usuario de forma anónima.</td>
                    </tr>
                    <tr>
                    <td>
                        <code>_gat</code>
                    </td>
                    <td>1 minuto</td>
                    <td>Limita el número de peticiones enviadas a Google Analytics.</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <h3>Cookies de marketing y redes sociales</h3>
            <div className={styles.tableWrap}>
                <table>
                <thead>
                    <tr>
                    <th>Cookie</th>
                    <th>Proveedor</th>
                    <th>Duración</th>
                    <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>
                        <code>_fbp</code>
                    </td>
                    <td>Meta</td>
                    <td>3 meses</td>
                    <td>Mide la eficacia de campañas publicitarias de Facebook.</td>
                    </tr>
                    <tr>
                    <td>
                        <code>IDE</code>
                    </td>
                    <td>Google</td>
                    <td>1 año</td>
                    <td>Mide conversiones de anuncios de Google Ads.</td>
                    </tr>
                    <tr>
                    <td>
                        <code>VISITOR_INFO1_LIVE</code>
                    </td>
                    <td>YouTube</td>
                    <td>240 días</td>
                    <td>Estima el ancho de banda para vídeos de YouTube incrustados.</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </section>

            <section className={styles.section}>
            <h2>Cómo gestionar las cookies</h2>
            <p>
                Puedes aceptar, rechazar o configurar las cookies en cualquier momento desde el banner que aparece en tu primera visita, o desde el enlace «Preferencias de cookies» del pie de página.
            </p>
            <p>También puedes gestionar las cookies directamente desde tu navegador:</p>
            <ul>
                <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                    Google Chrome
                </a>
                </li>
                <li>
                <a
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Mozilla Firefox
                </a>
                </li>
                <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                    Apple Safari
                </a>
                </li>
                <li>
                <a
                    href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Microsoft Edge
                </a>
                </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
                Ten en cuenta que bloquear todas las cookies puede afectar al funcionamiento de algunas partes de la plataforma.
            </p>
            </section>

            <section className={styles.section}>
            <h2>Cookies de terceros</h2>
            <p>Algunos proveedores tienen sus propios mecanismos de opt-out:</p>
            <div className={styles.infoCard}>
                <strong>Google Analytics</strong>
                <p>
                Instala el{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                    complemento de inhabilitación para navegadores
                </a>{' '}
                de Google Analytics.
                </p>
            </div>
            <div className={styles.infoCard}>
                <strong>Meta (Facebook / Instagram)</strong>
                <p>
                Gestiona tus preferencias en el{' '}
                <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer">
                    Centro de preferencias de anuncios de Facebook
                </a>
                .
                </p>
            </div>
            <div className={styles.infoCard}>
                <strong>Publicidad comportamental en general</strong>
                <p>
                Puedes gestionar las preferencias de múltiples anunciantes en{' '}
                <a href="http://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
                    youronlinechoices.eu
                </a>
                .
                </p>
            </div>
            </section>

            <section className={styles.section}>
            <h2>Cambios en esta política</h2>
            <p>
                Podemos actualizar esta política cuando añadamos o eliminemos cookies, o cuando cambie la normativa aplicable. Te avisaremos de cambios relevantes mediante un aviso en la plataforma o solicitando de nuevo tu consentimiento si fuera necesario.
            </p>
            </section>

            <section className={styles.section}>
            <h2>Contacto</h2>
            <div className={styles.contactBox}>
                <div className={styles.text}>
                <h3>¿Tienes dudas sobre las cookies?</h3>
                <p>Respondemos en menos de 48 horas hábiles.</p>
                </div>
                <a href="mailto:privacidad@tudominio.com">Escribirnos</a>
            </div>
            </section>
        </div>
        </div>
    );
    }