"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/styles/Navbar.module.scss";
import Link from "next/dist/client/link";

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    
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
                    <nav className={styles.nav}>
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
                <Link href="/">
                <div className={styles.logo}>
                    <Image src="/logoallcourts.png" alt="AllCourts Logo" width={40} height={40} />
                    <h1>AllCourts</h1>
                </div>
                </Link>
                <nav className={styles.nav}>
                    <button className={styles.navButton}>{t("header.btn_forplayers")}</button>
                    <button className={styles.navButton}>{t("header.btn_forclubs")}</button>
                    <div 
                        className={styles.dropdown}
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <button className={styles.profileButton}>{t("header.btn_profile")}</button>
                        {showDropdown && (
                            <div className={styles.dropdownMenu}>
                                <Link href="/login">
                                    <div className={styles.dropdownItem}>
                                        <span>👤</span>
                                        <div>
                                            <strong>{t("login.dropdown_login_player")}</strong>
                                            <p>{t("login.dropdown_label_player")}</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link href="/manager/login">
                                    <div className={styles.dropdownItem}>
                                        <span>🏢</span>
                                        <div>
                                            <strong>{t("login.dropdown_login_club")}</strong>
                                            <p>{t("login.dropdown_label_club")}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}       