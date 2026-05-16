import { useAuth } from "@/hooks/useAuth";
import { useRouteQueryParam } from "@/hooks/useRouteQueryParam";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

/**
 * @page Login
 * Pantalla de acceso para jugadores y managers.
 */
export default function Login() {
	const { t } = useTranslation();
	const { loading, error, login, resendVerification } = useAuth();
	const { value: registered } = useRouteQueryParam("registered");
	const { value: from } = useRouteQueryParam("from");

	const [role, setRole] = useState<"player" | "manager">("player");
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [notice, setNotice] = useState<string | null>(null);
	const [showResend, setShowResend] = useState(false);
	const [resendEmail, setResendEmail] = useState("");
	const [resendLoading, setResendLoading] = useState(false);
	const [resendStatus, setResendStatus] = useState<string | null>(null);

	useEffect(() => {
		if (registered === "1") {
			setNotice(t("login.registered_notice"));
		}
	}, [registered]);

	useEffect(() => {
		setShowResend(Boolean(error && /verif/i.test(error)));
	}, [error]);

	const handleResend = async () => {
		if (!resendEmail) return;
		setResendLoading(true);
		try {
			await resendVerification(resendEmail);
			setResendStatus(t("resendVerification.success"));
		} catch {
			setResendStatus(t("resendVerification.error"));
		} finally {
			setResendLoading(false);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await login(
			{ identifier, password, requestPortal: role },
			typeof from === "string" ? from : undefined,
		);
	};

	return (
		<div className={styles.container}>
			<div className={styles.loginCard}>
				<h1>
					{role === "player"
						? t("login.title")
						: t("login.title_manager")}
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
				{showResend && (
					<div className={styles.resendBlock}>
						<p className={styles.subtitle}>
							{t("resendVerification.prompt")}
						</p>
						<div className={styles.inputGroup}>
							<label>{t("resendVerification.label_email")}</label>
							<input
								type="email"
								value={resendEmail}
								onChange={(e) => setResendEmail(e.target.value)}
								placeholder={t("login.email_placeholder")}
							/>
						</div>
						<button
							type="button"
							className={styles.resendButton}
							disabled={resendLoading}
							onClick={handleResend}
						>
							{resendLoading
								? "..."
								: t("resendVerification.btn")}
						</button>
						{resendStatus && (
							<p className={styles.subtitle}>{resendStatus}</p>
						)}
					</div>
				)}

				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.inputGroup}>
						<label>{t("login.email")}</label>
						<input
							type="text"
							placeholder={t("login.email_placeholder")}
							value={identifier}
							onChange={(event) =>
								setIdentifier(event.target.value)
							}
						/>
					</div>

					<div className={styles.inputGroup}>
						<label>{t("login.password")}</label>
						<input
							type="password"
							placeholder={t("login.password_placeholder")}
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
						/>
					</div>

					<div className={styles.forgotPassword}>
						<Link href="/forgot-password">
							{t("login.forgot_password")}
						</Link>
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
