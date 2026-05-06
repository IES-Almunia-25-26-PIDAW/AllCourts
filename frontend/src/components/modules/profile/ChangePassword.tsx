import { useState } from "react";
import styles from "./ChangePassword.module.scss";
import { updateUserPassword } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";

export default function ChangePassword() {
	const { user } = useAuth();

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
			setError("La contraseña debe tener al menos 8 caracteres");
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("Las contraseñas no coinciden");
			return;
		}

		setSaving(true);
		try {
			await updateUserPassword(user.id, currentPassword, newPassword);
			setMessage("Contraseña actualizada correctamente");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			setError("Error al cambiar la contraseña");
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
			<h2 className={styles.sectionTitle}>Cambiar contraseña</h2>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label htmlFor="current">Contraseña actual</label>
					<input
						id="current"
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						placeholder="Contraseña actual"
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="new">Nueva contraseña</label>
					<input
						id="new"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder="Nueva contraseña (mín. 8 caracteres)"
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="confirm">Confirmar contraseña</label>
					<input
						id="confirm"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirmar nueva contraseña"
					/>
				</div>

				<div className={styles.actions}>
					<button
						type="submit"
						disabled={saving}
						className={styles.btnPrimary}
					>
						{saving ? "Cambiando..." : "Cambiar contraseña"}
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
						Limpiar
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
