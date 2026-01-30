"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/styles/Navbar.module.scss";

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        return (
            <header className={styles.navbar}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <Image src="/logoallcourts.png" alt="AllCourts Logo" width={40} height={40} />
                        <h1>AllCourts</h1>
                    </div>
                    <nav>
                        <button className={styles.navButton}>Para Jugadores</button>
                        <button className={styles.navButton}>Para Clubes</button>
                        <button className={styles.profileButton}>Perfil</button>
                    </nav>
                </div>
            </header>
        );
    }
    
    return (
        <header className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Image src="/logoallcourts.png" alt="AllCourts Logo" width={40} height={40} />
                    <h1>AllCourts</h1>
                </div>
                <nav>
                    <button className={styles.navButton}>{t("header.btn_forplayers")}</button>
                    <button className={styles.navButton}>{t("header.btn_forclubs")}</button>
                    <button className={styles.profileButton}>{t("header.btn_profile")}</button>
                </nav>
            </div>
        </header>
    );
}       