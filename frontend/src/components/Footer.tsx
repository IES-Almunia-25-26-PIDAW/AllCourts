"use client";

import styles from "@/styles/Footer.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} AllCourts. All rights reserved.</p>
        </footer>
    );
}