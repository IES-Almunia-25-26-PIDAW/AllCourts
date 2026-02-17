"use client";

import styles from "@/styles/Footer.module.scss";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <div className={styles.logoCol}>
                    <img src="/logonegro.png" alt="AllCourts Logo" />
                    <span className={styles.logoText}></span>
                </div>

                <div className={styles.linksCol}>
                    <p className={styles.colTitle}>AllCourts</p>
                    <a href="" className={styles.link}>Pistas</a>
                    <a href="/register" className={styles.link}>Registrarse</a>
                    <a href="/login" className={styles.link}>Iniciar Sesión</a>
                </div>

                <div className={styles.linksCol}>
                    <p className={styles.colTitle}>Legal</p>
                    <a href="" className={styles.link}>Política de privacidad</a>
                    <a href="" className={styles.link}>Política de cookies</a>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p className={styles.copyright}>&copy; {new Date().getFullYear()} {t("footer.text")}</p>
            </div>
        </footer>
    );
}