import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/pages/404.module.scss';

export default function Custom500() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>500</h1>
            <h2 className={styles.subtitle}>{t('500.title')}</h2>
            <p className={styles.message}>{t('500.message')}</p>
            <Link href="/" className={styles.homeLink}>
                {t('500.action')}
            </Link>
        </div>
    );
}