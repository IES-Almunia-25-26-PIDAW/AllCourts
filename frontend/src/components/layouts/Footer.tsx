import styles from "./Footer.module.scss";
import { useTranslation } from "react-i18next";

const currentYear = new Date().getFullYear();

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
          <p className={styles.colTitle}>{t("footer.column1_title")}</p>
          <a href="/clubs" className={styles.link}>
            {t("footer.column1_link1")}
          </a>
          <a href="/register" className={styles.link}>
            {t("footer.column1_link2")}
          </a>
          <a href="/player/login" className={styles.link}>
            {t("footer.column1_link3")}
          </a>
        </div>

        <div className={styles.linksCol}>
          <p className={styles.colTitle}>{t("footer.column2_title")}</p>
          <a href="/policy/cookies" className={styles.link}>
            {t("footer.column2_link1")}
          </a>
          <a href="/policy/privacy" className={styles.link}>
            {t("footer.column2_link2")}
          </a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          &copy; {currentYear} {t("footer.text")}
        </p>
      </div>
    </footer>
  );
}
