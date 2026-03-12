import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/dist/client/link";

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [langLabel, setLangLabel] = useState<string | null>(null);

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('en') ? 'es' : 'en';
        i18n.changeLanguage(newLang);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('i18nextLng', newLang);
            } catch {}
            document.cookie = `i18nextLng=${newLang};path=/`;
        }
    };

    useEffect(() => {
        setLangLabel(i18n.language.startsWith('en') ? 'ES' : 'EN');
    }, [i18n.language]);

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
                        <>
                            <button className={styles.navButton} onClick={toggleLanguage}>
                                {langLabel ?? ''}
                            </button>
                            <Link href="/info/player">
                                <button className={styles.navButton}>{t("header.btn_forplayers")}</button>
                            </Link>
                            <Link href="/info/manager">
                                <button className={styles.navButton}>{t("header.btn_forclubs")}</button>
                            </Link>
                            <Link href="/login">
                                <button className={styles.profileButton}>{t("header.btn_profile")}</button>
                            </Link>
                        </>
                </nav>
            </div>
        </header>
    );
}