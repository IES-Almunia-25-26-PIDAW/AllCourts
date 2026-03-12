import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/pages/Register.module.scss'; 
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();
    const [role, setRole] = useState<'player' | 'club'>('player');

    return (
        <div className={styles.container}>
            <div className={styles.registerCard}>
                <h1>
                    {t("register.title")}
                </h1>
                <p className={styles.subtitle}>
                    {t("register.subtitle")}
                </p>

                <div className={styles.roleToggle}>
                    <button
                        type="button"
                        className={`${styles.roleBtn} ${role === 'player' ? styles.active : ''}`}
                        onClick={() => setRole('player')}
                    >
                        🎾 {t("register.option_player")}
                    </button>
                    <button
                        type="button"
                        className={`${styles.roleBtn} ${role === 'club' ? styles.active : ''}`}
                        onClick={() => setRole('club')}
                    >
                        🏟️ {t("register.option_club")}
                    </button>
                </div>

                <form className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>{t("register.form_name")}</label>
                            <input
                                type="text"
                                placeholder={t("register.form_name_placeholder")}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>{t("register.form_lastname")}</label>
                            <input
                                type="text"
                                placeholder={t("register.form_lastname_placeholder")}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t("register.form_email")}</label>
                        <input
                            type="email"
                            placeholder={t("register.form_email_placeholder")}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t("register.form_username")}</label>
                        <input
                            type="text"
                            placeholder={t("register.form_username_placeholder")}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t("register.form_password")}</label>
                        <input
                            type="password"
                            placeholder={t("register.form_password_placeholder")}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{t("register.form_confirm_password")}</label>
                        <input
                            type="password"
                            placeholder={t("register.form_confirm_password_placeholder")}
                        />
                    </div>

                    <button type="submit" className={styles.registerButton}>
                        {t("register.btn_register")}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>{t("register.or")}</span>
                </div>

                <div className={styles.loginLink}>
                    {t("register.login_link")}{' '}
                    <Link href="/login">
                        {t("register.login_link2")}
                    </Link>
                </div>
            </div>
        </div>
    );
}