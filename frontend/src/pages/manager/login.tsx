"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/Login.module.scss';

export default function LoginManager() {
    const { t } = useTranslation();
    
    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1>{t("login.title_club")}</h1>
                <p className={styles.subtitle}>
                    {t("login.subtitle")}
                </p>
                
                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>{t("login.username")}</label>
                        <input 
                            type="text" 
                            placeholder={t("login.username_placeholder")} 
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>{t("login.password")}</label>
                        <input 
                            type="password" 
                            placeholder={t("login.password_placeholder")} 
                        />
                    </div>
                    
                    <button type="submit" className={styles.loginButton}>
                        {t("login.btn_login")}
                    </button>
                    
                    <div className={styles.forgotPassword}>
                        <Link href="/forgot-password">
                            {t("login.forgot_password")}
                        </Link>
                    </div>
                </form>
                
                <div className={styles.divider}>
                    <span>{t("login.or")}</span>
                </div>
                
                <div className={styles.registerLink}>
                    {t("login.no_account")}{' '}
                    <Link href="/register">
                        {t("login.register")}
                    </Link>
                </div>
            </div>
        </div>
    );
}