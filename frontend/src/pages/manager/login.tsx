"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import styles from '@/styles/Login.module.scss';

export default function LoginManager() {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1>{mounted ? t("login.title_club") : "Iniciar Sesión"}</h1>
                <p className={styles.subtitle}>
                    {mounted ? t("login.subtitle") : "Bienvenido de nuevo a AllCourts"}
                </p>
                
                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>{mounted ? t("login.username") : "Usuario"}</label>
                        <input 
                            type="text" 
                            placeholder={mounted ? t("login.username_placeholder") : "Ingresa tu usuario"} 
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>{mounted ? t("login.password") : "Contraseña"}</label>
                        <input 
                            type="password" 
                            placeholder={mounted ? t("login.password_placeholder") : "Ingresa tu contraseña"} 
                        />
                    </div>
                    
                    <button type="submit" className={styles.loginButton}>
                        {mounted ? t("login.btn_login") : "Iniciar Sesión"}
                    </button>
                    
                    <div className={styles.forgotPassword}>
                        <Link href="/forgot-password">
                            {mounted ? t("login.forgot_password") : "¿Olvidaste tu contraseña?"}
                        </Link>
                    </div>
                </form>
                
                <div className={styles.divider}>
                    <span>{mounted ? t("login.or") : "o"}</span>
                </div>
                
                <div className={styles.registerLink}>
                    {mounted ? t("login.no_account") : "¿No tienes cuenta?"}{' '}
                    <Link href="/register">
                        {mounted ? t("login.register") : "Regístrate"}
                    </Link>
                </div>
            </div>
        </div>
    );
}