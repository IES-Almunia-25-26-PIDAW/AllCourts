import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import { register as registerRequest } from "@/api/authApi";

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();

  const [role, setRole] = useState<"player" | "manager">("player");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await registerRequest({
        name: `${name} ${lastname}`.trim(),
        username,
        email,
        password,
        role,
      });

      router.push("/login?registered=1");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registro fallido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <h1>{t("register.title")}</h1>
        <p className={styles.subtitle}>{t("register.subtitle")}</p>

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

        {error ? <p className={styles.subtitle}>{error}</p> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>{t("register.form_name")}</label>
              <input
                type="text"
                placeholder={t("register.form_name_placeholder")}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t("register.form_lastname")}</label>
              <input
                type="text"
                placeholder={t("register.form_lastname_placeholder")}
                value={lastname}
                onChange={(event) => setLastname(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>{t("register.form_email")}</label>
            <input
              type="email"
              placeholder={t("register.form_email_placeholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("register.form_username")}</label>
            <input
              type="text"
              placeholder={t("register.form_username_placeholder")}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("register.form_password")}</label>
            <input
              type="password"
              placeholder={t("register.form_password_placeholder")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("register.form_confirm_password")}</label>
            <input
              type="password"
              placeholder={t("register.form_confirm_password_placeholder")}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <button type="submit" className={styles.registerButton} disabled={loading}>
            {loading ? "..." : t("register.btn_register")}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t("register.or")}</span>
        </div>

        <div className={styles.loginLink}>
          {t("register.login_link")} <Link href="/login">{t("register.login_link2")}</Link>
        </div>
      </div>
    </div>
  );
}
