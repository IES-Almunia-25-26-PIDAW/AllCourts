import { useAuth } from '@/hooks/useAuth';
import { useRouteQueryParam } from '@/hooks/useRouteQueryParam';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './[token].module.scss';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const { ready, value: queryToken } = useRouteQueryParam('token');
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof queryToken !== 'string' || !queryToken) {
      setError('No se encontró el token de recuperación.');
      setLoading(false);
      return;
    }

    setToken(queryToken);
    setLoading(false);
  }, [queryToken, ready]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError(t('resetPassword.error_mismatch'));
      return;
    }

    if (!token) return;

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await resetPassword(token, password);
      setMessage(t('resetPassword.success'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('resetPassword.title')}</h1>

        {loading ? (
          <p className={styles.message}>Comprobando el enlace...</p>
        ) : (
          <>
            {message ? <p className={styles.success}>{message}</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            {!message ? (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label>{t('resetPassword.label_password')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>{t('resetPassword.label_confirm')}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.button} disabled={submitting}>
                  {submitting ? '...' : t('resetPassword.btn_submit')}
                </button>
              </form>
            ) : null}
            {message ? (
              <div className={styles.footerLink}>
                <Link href="/login">{t('resetPassword.link_login')}</Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
