import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Custom404() {
    const { t } = useTranslation();

    return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h1>{t('404.title')}</h1>
        <p>{t('404.message')}</p>
        <Link href="/">{t('404.action')}</Link>
        </div>
    );
}