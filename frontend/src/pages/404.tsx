//#region MODULES
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/pages/404.module.scss';
//#endregion

/**
 * @page Custom404
 * Página de error 404 personalizada que Next.js muestra cuando
 * no encuentra la ruta solicitada.
 * Muestra un mensaje traducido y un enlace para volver al inicio.
 */
export default function Custom404() {
    //#region VARIABLES
    const { t } = useTranslation();
    //#endregion

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <h2 className={styles.subtitle}>{t('404.title')}</h2>
            <p className={styles.message}>{t('404.message')}</p>
            <Link href="/" className={styles.homeLink}>
                {t('404.action')}
            </Link>
        </div>
    );
}