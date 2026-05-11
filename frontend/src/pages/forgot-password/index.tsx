import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from "./index.module.scss";
export default function ForgotPasswordPage() {
/**
 * @page ForgotPassword
 * Pantalla para solicitar un enlace de recuperación de contraseña.
 */
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await forgotPassword(email);
      setMessage(t('forgotPassword.success'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el enlace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('forgotPassword.title')}</h1>
        <p className={styles.subtitle}>{t('forgotPassword.subtitle')}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>{t('forgotPassword.label_email')}</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('forgotPassword.label_email')}
              required
            />
          </div>

          {message ? <p className={styles.success}>{message}</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '...' : t('forgotPassword.btn_send')}
          </button>
        </form>

        <div className={styles.footerLink}>
          <Link href="/login">{t('forgotPassword.back_login')}</Link>
        </div>
      </div>
    </div>
  );
}
