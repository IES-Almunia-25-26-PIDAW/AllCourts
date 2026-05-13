import { useAuth } from '@/hooks/useAuth';
import { useRouteQueryParam } from '@/hooks/useRouteQueryParam';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './[token].module.scss';

/**
 * @page VerifyEmail
 * Página para verificar la cuenta mediante un token enviado por correo.
 */
export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const { t } = useTranslation();
  const { ready, value: token } = useRouteQueryParam('token');
  const [message, setMessage] = useState<string | null>(t('verify.checking'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof token !== 'string' || !token) {
      setMessage(t('verify.token_missing'));
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setMessage(t('verify.success'));
      } catch (error) {
        setMessage(error instanceof Error ? error.message : t('verify.error_generic'));
      } finally {
        setLoading(false);
      }
    };

    void verify();
  }, [ready, token, verifyEmail]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('verify.title')}</h1>
        <p className={styles.message}>{loading ? t('verify.checking') : message}</p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            {t('verify.btn_login')}
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            {t('verify.btn_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
