    import styles from './Privacy.module.scss';

    export default function PrivacyPolicy() {
    return (
        <div className={styles.main}>
        <section className={styles.hero}>
            <div className={styles.heroInner}>
            <h1>
                Política de <span>Privacidad</span>
            </h1>
            <p>
                Te explicamos de forma clara cómo recogemos, usamos y protegemos tus datos personales, de acuerdo con el RGPD.
            </p>
            <div className={styles.heroMeta}>
                <span>Actualizado: enero 2025</span>
                <span>Reglamento (UE) 2016/679</span>
            </div>
            </div>
        </section>

        <div className={styles.pageWrap}>
            <section className={styles.section}>
            <h2>Responsable del tratamiento</h2>
            <p>
                En cumplimiento del <strong>Reglamento (UE) 2016/679 (RGPD)</strong>, te informamos de que el responsable del tratamiento de tus datos es:
            </p>
            <div className={styles.infoCard}>
                <strong>Datos del responsable</strong>
                <p>
                <strong>Razón social:</strong> [Nombre de tu empresa], S.L.<br />
                <strong>CIF:</strong> B-XXXXXXXXX<br />
                <strong>Domicilio:</strong> Calle Ejemplo, 00 – 00000 Ciudad (España)<br />
                <strong>Email:</strong> privacidad@tudominio.com<br />
                <strong>DPO:</strong> dpo@tudominio.com
                </p>
            </div>
            </section>

            <section className={styles.section}>
            <h2>¿Para qué usamos tus datos?</h2>
            <p>
                Tratamos tus datos únicamente para las finalidades que se detallan a continuación, cada una amparada en una base jurídica legítima conforme al artículo 6 del RGPD.
            </p>
            <div className={styles.tableWrap}>
                <table>
                <thead>
                    <tr>
                    <th>Finalidad</th>
                    <th>Datos tratados</th>
                    <th>Base legal</th>
                    <th>Conservación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Creación de cuenta y gestión del perfil</td>
                    <td>Nombre, email, teléfono, foto</td>
                    <td><span className={styles.badgeBlue}>Contrato</span></td>
                    <td>10 años</td>
                    </tr>
                    <tr>
                    <td>Reserva de instalaciones deportivas</td>
                    <td>Nombre, email, datos de pago</td>
                    <td><span className={styles.badgeBlue}>Contrato</span></td>
                    <td>10 años</td>
                    </tr>
                    <tr>
                    <td>Gestión de pagos</td>
                    <td>Datos de tarjeta (tokenizados)</td>
                    <td><span className={styles.badgeBlue}>Contrato</span></td>
                    <td>5 años</td>
                    </tr>
                    <tr>
                    <td>Búsqueda de compañeros de juego</td>
                    <td>Nombre, foto, nivel deportivo</td>
                    <td><span className={styles.badgeGreen}>Consentimiento</span></td>
                    <td>Hasta retirada</td>
                    </tr>
                    <tr>
                    <td>Comunicaciones de marketing</td>
                    <td>Nombre, email, comportamiento en app</td>
                    <td><span className={styles.badgeGreen}>Consentimiento</span></td>
                    <td>Hasta retirada</td>
                    </tr>
                    <tr>
                    <td>Atención al cliente</td>
                    <td>Nombre, email, historial de consultas</td>
                    <td><span className={styles.badgeBlue}>Interés legítimo</span></td>
                    <td>3 años</td>
                    </tr>
                    <tr>
                    <td>Mejora del servicio y analítica</td>
                    <td>Datos de uso anonimizados, IP</td>
                    <td><span className={styles.badgeBlue}>Interés legítimo</span></td>
                    <td>2 años</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <h3>Notificaciones</h3>
            <p>
                Con tu consentimiento, podemos enviarte notificaciones sobre tu actividad en la plataforma por email, push o SMS. Puedes gestionarlas en cualquier momento desde los ajustes de tu cuenta.
            </p>
            </section>

            <section className={styles.section}>
            <h2>¿Qué datos recogemos?</h2>
            <div className={styles.infoCard}>
                <strong>Datos que tú nos facilitas</strong>
                <p>Nombre, email, teléfono, foto de perfil, nivel deportivo, datos de pago y preferencias de juego.</p>
            </div>
            <div className={styles.infoCard}>
                <strong>Datos generados por el uso del servicio</strong>
                <p>Historial de reservas, estadísticas deportivas, valoraciones, conversaciones en el chat y participación en torneos.</p>
            </div>
            <div className={styles.infoCard}>
                <strong>Datos técnicos recogidos automáticamente</strong>
                <p>Dirección IP, tipo de navegador, sistema operativo, páginas visitadas y cookies. La localización solo si la autorizas expresamente.</p>
            </div>
            </section>

            <section className={styles.section}>
            <h2>¿Con quién compartimos tus datos?</h2>
            <p>Tus datos <strong>no se venden</strong> ni ceden a terceros con fines comerciales propios. Solo se comparten con:</p>
            <ul>
                <li>Proveedor de pasarela de pago, para procesar transacciones de forma segura (PCI-DSS).</li>
                <li>Proveedor de hosting, para el alojamiento de la plataforma en servidores dentro de la UE.</li>
                <li>Herramientas de analítica (p. ej. Google Analytics), bajo tu consentimiento previo.</li>
                <li>Gestores de instalaciones deportivas, únicamente los datos necesarios para tu reserva.</li>
                <li>Autoridades públicas, cuando exista una obligación legal.</li>
            </ul>
            <div className={styles.highlightBox}>
                <p>
                <strong>Transferencias internacionales:</strong> Si algún proveedor está fuera del Espacio Económico Europeo, la transferencia estará amparada por decisiones de adecuación de la Comisión Europea o Cláusulas Contractuales Tipo.
                </p>
            </div>
            </section>

            <section className={styles.section}>
            <h2>Tus derechos</h2>
            <p>
                El RGPD te reconoce los siguientes derechos sobre tus datos. Puedes ejercerlos escribiendo a <strong>privacidad@tudominio.com</strong>. Responderemos en un máximo de 30 días.
            </p>
            <div className={styles.rightsGrid}>
                <div className={styles.rightCard}>
                <div className={styles.icon}>👁️</div>
                <h4>Acceso</h4>
                <p>Saber qué datos tenemos sobre ti.</p>
                </div>
                <div className={styles.rightCard}>
                <div className={styles.icon}>✏️</div>
                <h4>Rectificación</h4>
                <p>Corregir datos inexactos.</p>
                </div>
                <div className={styles.rightCard}>
                <div className={styles.icon}>🗑️</div>
                <h4>Supresión</h4>
                <p>Solicitar el borrado de tus datos.</p>
                </div>
                <div className={styles.rightCard}>
                <div className={styles.icon}>⏸️</div>
                <h4>Limitación</h4>
                <p>Suspender el tratamiento.</p>
                </div>
                <div className={styles.rightCard}>
                <div className={styles.icon}>📦</div>
                <h4>Portabilidad</h4>
                <p>Recibir tus datos en formato legible.</p>
                </div>
                <div className={styles.rightCard}>
                <div className={styles.icon}>🚫</div>
                <h4>Oposición</h4>
                <p>Oponerte al tratamiento.</p>
                </div>
            </div>
            <p style={{ marginTop: '20px' }}>
                Si consideras que vulneramos tus derechos, puedes reclamar ante la{' '}
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                Agencia Española de Protección de Datos (AEPD)
                </a>.
            </p>
            </section>

            <section className={styles.section}>
            <h2>Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos:</p>
            <ul>
                <li>Cifrado en tránsito mediante TLS 1.3.</li>
                <li>Cifrado en reposo con AES-256.</li>
                <li>Autenticación de doble factor disponible para todas las cuentas.</li>
                <li>Auditorías de seguridad periódicas.</li>
                <li>Plan de respuesta ante brechas con notificación a la AEPD en menos de 72 horas si procede.</li>
            </ul>
            </section>

            <section className={styles.section}>
            <h2>Menores de edad</h2>
            <div className={styles.highlightBox}>
                <p>
                Nuestro servicio está dirigido a personas <strong>mayores de 14 años</strong>. Si detectas que un menor nos ha facilitado datos sin autorización de su tutor legal, contáctanos en privacidad@tudominio.com para proceder a su eliminación inmediata.
                </p>
            </div>
            </section>

            <section className={styles.section}>
            <h2>Cambios en esta política</h2>
            <p>
                Podemos actualizar esta política para reflejar cambios en el servicio o en la legislación. Si los cambios son relevantes, te lo notificaremos por email o mediante un aviso en la plataforma antes de que entren en vigor.
            </p>
            </section>

            <section className={styles.section}>
            <h2>Contacto</h2>
            <div className={styles.contactBox}>
                <div className={styles.text}>
                <h3>¿Tienes alguna pregunta?</h3>
                <p>Nuestro equipo de privacidad responde en menos de 48 horas hábiles.</p>
                </div>
                <a href="mailto:privacidad@tudominio.com">Escribirnos</a>
            </div>
            </section>
        </div>
        </div>
    );
    }