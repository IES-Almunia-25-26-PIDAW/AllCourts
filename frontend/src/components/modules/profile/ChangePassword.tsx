import { updateUserPassword } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ChangePassword.module.scss";

/**
 * @component ChangePassword
 * Formulario para actualizar la contraseña del usuario autenticado.
 */
export default function ChangePassword() {
	const { user } = useAuth();
	const { t } = useTranslation();

	const [currentPassword, setCurrentPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [saving, setSaving] = useState<boolean>(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setMessage(null);
		setError(null);

		if (newPassword.length < 8) {
			setError(t("profile.changepass_error_minlength"));
			return;
		}
		if (newPassword !== confirmPassword) {
			setError(t("profile.changepass_error_mismatch"));
			return;
		}

		setSaving(true);
		try {
			await updateUserPassword(user.id, currentPassword, newPassword);
			setMessage(t("profile.changepass_success"));
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			setError(t("profile.changepass_error_generic"));
		} finally {
			setSaving(false);
			setTimeout(() => {
				setMessage(null);
				setError(null);
			}, 2500);
		}
	};

	return (
		<section className={styles.section}>
			<h2 className={styles.sectionTitle}>
				{t("profile.changepass_title")}
			</h2>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label htmlFor="current">
						{t("profile.changepass_current_label")}
					</label>
					<input
						id="current"
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						placeholder={t(
							"profile.changepass_current_placeholder",
						)}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="new">
						{t("profile.changepass_new_label")}
					</label>
					<input
						id="new"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder={t("profile.changepass_new_placeholder")}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="confirm">
						{t("profile.changepass_confirm_label")}
					</label>
					<input
						id="confirm"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder={t(
							"profile.changepass_confirm_placeholder",
						)}
					/>
				</div>

				<div className={styles.actions}>
					<button
						type="submit"
						disabled={saving}
						className={styles.btnPrimary}
					>
						{saving
							? t("profile.changepass_changing")
							: t("profile.changepass_submit")}
					</button>
					<button
						type="button"
						onClick={() => {
							setCurrentPassword("");
							setNewPassword("");
							setConfirmPassword("");
							setMessage(null);
							setError(null);
						}}
						className={styles.btnSecondary}
					>
						{t("profile.changepass_clear")}
					</button>
				</div>

				{message && (
					<div className={styles.messageSuccess}>{message}</div>
				)}
				{error && <div className={styles.messageError}>{error}</div>}
			</form>
		</section>
	);
}
