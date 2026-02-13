"use client";

import styles from "@/styles/Footer.module.scss";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function Footer() {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} {t("footer.text")}</p>
        </footer>
    );
}