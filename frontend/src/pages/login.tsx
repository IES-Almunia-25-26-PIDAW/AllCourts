//#region MODULES
import Link from "next/link";
import { useState } from "react";
import styles from "@/styles/pages/Login.module.scss";
import { useTranslation } from "react-i18next";
//#endregion

/**
 * @page Login
 * Página de inicio de sesión con selector de rol (jugador o club).
 *
 * State:
 *   role → rol activo en el toggle ('player' | 'club'), por defecto 'player'
 */
export default function Login() {
  //#region VARIABLES
  const { t } = useTranslation();
  // Controla qué tipo de usuario está intentando iniciar sesión
  const [role, setRole] = useState<"player" | "club">("player");
  //#endregion

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1>{role === "player" ? t("login.title") : t("login.title_club")}</h1>
        <p className={styles.subtitle}>{t("login.subtitle")}</p>

        <div className={styles.roleToggle}>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === "player" ? styles.active : ""}`}
            onClick={() => setRole("player")}
          >
            🎾 {t("register.option_player")}
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === "club" ? styles.active : ""}`}
            onClick={() => setRole("club")}
          >
            🏟️ {t("register.option_club")}
          </button>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>{t("login.username")}</label>
            <input type="text" placeholder={t("login.username_placeholder")} />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("login.password")}</label>
            <input
              type="password"
              placeholder={t("login.password_placeholder")}
            />
          </div>

          <div className={styles.forgotPassword}>
            <Link href="/forgot-password">{t("login.forgot_password")}</Link>
          </div>

          <button type="submit" className={styles.loginButton}>
            {t("login.btn_login")}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t("login.or")}</span>
        </div>

        <div className={styles.registerLink}>
          {t("login.no_account")}{" "}
          <Link href="/register">{t("login.register")}</Link>
        </div>
      </div>
    </div>
  );
}
