import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import { login as loginRequest } from "@/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setAuth,
  setAuthError,
  setAuthLoading,
} from "@/store/slices/authSlice";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [role, setRole] = useState<"player" | "manager">("player");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.query.registered === "1") {
      setNotice(
        "Registro completado. Revisa tu correo para verificar la cuenta.",
      );
    }
  }, [router.isReady, router.query.registered]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const { user } = await loginRequest({ identifier, password });
      dispatch(setAuth(user));
      try {
        window.localStorage.setItem("allcourts_user", JSON.stringify(user));
      } catch {}
      router.push("/clubs");
    } catch (error) {
      dispatch(
        setAuthError(error instanceof Error ? error.message : "Login failed"),
      );
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1>
          {role === "player" ? t("login.title") : t("login.title_manager")}
        </h1>
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
            className={`${styles.roleBtn} ${role === "manager" ? styles.active : ""}`}
            onClick={() => setRole("manager")}
          >
            🏟️ {t("register.option_manager")}
          </button>
        </div>

        {notice ? <p className={styles.subtitle}>{notice}</p> : null}
        {error ? <p className={styles.subtitle}>{error}</p> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>{t("login.email")}</label>
            <input
              type="text"
              placeholder={t("login.email_placeholder")}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("login.password")}</label>
            <input
              type="password"
              placeholder={t("login.password_placeholder")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className={styles.forgotPassword}>
            <Link href="/forgot-password">{t("login.forgot_password")}</Link>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "..." : t("login.btn_login")}
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
