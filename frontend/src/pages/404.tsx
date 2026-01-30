import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/404.module.scss';

export default function Custom404() {
    const { t } = useTranslation();

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