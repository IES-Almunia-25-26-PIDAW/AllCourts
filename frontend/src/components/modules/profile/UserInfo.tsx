import { updateUser, updateUserForm } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import { setAuth } from "@/store/slices/authSlice";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styles from "./UserInfo.module.scss";

/**
 * @component UserInfo
 * Formulario de edición de datos básicos y avatar del perfil.
 */
export default function UserInfo() {
	const { user } = useAuth();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [name, setName] = useState<string>(user?.name ?? "");
	const [username, setUsername] = useState<string>(user?.username ?? "");
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		user?.avatar_url ?? null,
	);
	const [saving, setSaving] = useState<boolean>(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		setName(user?.name ?? "");
		setUsername(user?.username ?? "");
		setAvatarPreview(user?.avatar_url ?? null);
	}, [user]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0] ?? null;
		if (!f) return;
		setAvatarFile(f);
		const reader = new FileReader();
		reader.onload = () => {
			setAvatarPreview(
				typeof reader.result === "string" ? reader.result : null,
			);
		};
		reader.readAsDataURL(f);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;
		setSaving(true);
		setMessage(null);
		try {
			let serverUser: any = null;

			if (avatarFile) {
				const fd = new FormData();
				fd.append("name", name.trim() || user.name);
				fd.append("username", username.trim() || user.username);
				if (user?.phone) fd.append("phone", user.phone);
				fd.append("avatar", avatarFile);
				serverUser = await updateUserForm(user.id, fd);
			} else {
				const payload = {
					name: name.trim() || user.name,
					username: username.trim() || user.username,
					avatar_url: avatarPreview ?? user.avatar_url,
				};
				await updateUser(user.id, payload);
				serverUser = { ...user, ...payload };
			}

			dispatch(setAuth(serverUser));
			setMessage(t("profile.userinfo_save_success"));
			setAvatarFile(null);
		} catch (err) {
			setMessage(t("profile.userinfo_save_error"));
		} finally {
			setSaving(false);
			setTimeout(() => setMessage(null), 2500);
		}
	};

	return (
		<section className={styles.section}>
			<h2 className={styles.sectionTitle}>
				{t("profile.userinfo_title")}
			</h2>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label htmlFor="name">
						{t("profile.userinfo_name_label")}
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={t("profile.userinfo_name_placeholder")}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="username">
						{t("profile.userinfo_username_label")}
					</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder={t("profile.userinfo_username_placeholder")}
					/>
				</div>

				<div className={styles.formGroup}>
					<label>{t("profile.userinfo_avatar_label")}</label>
					<div className={styles.avatarSection}>
						<div className={styles.avatarPreviewBox}>
							{avatarPreview ? (
								<img
									src={avatarPreview}
									alt="preview"
									className={styles.avatarImg}
								/>
							) : (
								<div className={styles.avatarPlaceholder}>
									{(name || username || "U")
										.slice(0, 1)
										.toUpperCase()}
								</div>
							)}
						</div>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className={styles.fileInput}
						/>
					</div>
				</div>

				<div className={styles.actions}>
					<button
						type="submit"
						disabled={saving}
						className={styles.btnPrimary}
					>
						{saving
							? t("profile.userinfo_saving")
							: t("profile.userinfo_save")}
					</button>
					<button
						type="button"
						onClick={() => {
							setName(user?.name || "");
							setUsername(user?.username || "");
							setAvatarPreview(user?.avatar_url || null);
							setAvatarFile(null);
							setMessage(null);
						}}
						className={styles.btnSecondary}
					>
						{t("profile.userinfo_discard")}
					</button>
					{message && (
						<span className={styles.message}>{message}</span>
					)}
				</div>
			</form>
		</section>
	);
}
