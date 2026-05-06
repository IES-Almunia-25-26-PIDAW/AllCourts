import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./UserInfo.module.scss";
import { setAuth } from "@/store/slices/authSlice";
import { updateUser, updateUserForm } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";

export default function UserInfo() {
  const { user } = useAuth();
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
      try {
        window.localStorage.setItem(
          "allcourts_user",
          JSON.stringify(serverUser),
        );
      } catch {}
      setMessage("Guardado");
      setAvatarFile(null);
    } catch (err) {
      setMessage("Error al guardar");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Información del usuario</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Avatar</label>
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
                  {(name || username || "U").slice(0, 1).toUpperCase()}
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
          <button type="submit" disabled={saving} className={styles.btnPrimary}>
            {saving ? "Guardando..." : "Guardar cambios"}
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
            Descartar
          </button>
          {message && <span className={styles.message}>{message}</span>}
        </div>
      </form>
    </section>
  );
}
