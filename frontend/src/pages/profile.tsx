import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "@/styles/pages/Profile.module.scss";
import { clearAuth, setAuth } from "@/store/slices/authSlice";
import { logout as logoutRequest } from "@/api/authApi";
import { updateUser, updateUserForm } from "@/api/userApi";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [section, setSection] = useState<string>("active");

  // form state for Información
  const [name, setName] = useState<string>(user?.name ?? "");
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar_url ?? null,
  );
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name ?? "");
    setUsername(user?.username ?? "");
    setAvatarPreview(user?.avatar_url ?? null);
  }, [user]);

  const handleLogout = () => {
    (async () => {
      try { await logoutRequest(); } catch {}
      try { window.localStorage.removeItem("allcourts_user"); } catch {}
      dispatch(clearAuth());
      router.push("/");
    })();
  };

  

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

  const handleSaveInfo = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMessage(null);
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
      try { window.localStorage.setItem("allcourts_user", JSON.stringify(serverUser)); } catch {}
      setSaveMessage("Guardado");
    } catch (err) {
      setSaveMessage("Error al guardar");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 2500);
    }
  };

  return (
    <div className={styles.pageWrap}>
      <aside className={styles.sidebar}>
        <div className={styles.profileSummary}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {(user?.name || user?.username || "U").slice(0, 1)}
            </div>
          )}
          <div className={styles.userInfo}>
            <strong>{user?.name || user?.username}</strong>
            <span>{user?.email}</span>
          </div>
        </div>

        <nav className={styles.menu}>
          <button
            className={section === "active" ? styles.active : undefined}
            onClick={() => setSection("active")}
          >
            Reservas activas
          </button>
          <button
            className={section === "past" ? styles.active : undefined}
            onClick={() => setSection("past")}
          >
            Reservas pasadas
          </button>
          <button
            className={section === "info" ? styles.active : undefined}
            onClick={() => setSection("info")}
          >
            Información
          </button>
          <button
            className={section === "password" ? styles.active : undefined}
            onClick={() => setSection("password")}
          >
            Cambiar contraseña
          </button>
          <button onClick={handleLogout} className={styles.logout}>
            Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className={styles.content}>
        {section === "active" && (
          <section>
            <h2>Reservas activas</h2>
            <p>Aquí aparecerán las reservas activas del usuario.</p>
          </section>
        )}

        {section === "past" && (
          <section>
            <h2>Reservas pasadas</h2>
            <p>Aquí aparecerán las reservas pasadas del usuario.</p>
          </section>
        )}

        {section === "info" && (
          <section>
            <h2>Información del usuario</h2>
            <form className={styles.infoForm} onSubmit={handleSaveInfo}>
              <div className={styles.formRow}>
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className={styles.formRow}>
                <label>Usuario</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <label>Avatar</label>
                <div className={styles.avatarUploadRow}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="preview"
                      className={styles.avatarPreview}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholderSmall}>
                      {(name || username || "U").slice(0, 1)}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" disabled={saving}>
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setUsername(user?.username || "");
                    setAvatarPreview(user?.avatar_url || null);
                  }}
                >
                  Restablecer
                </button>
                {saveMessage && (
                  <span className={styles.saveMsg}>{saveMessage}</span>
                )}
              </div>
            </form>
          </section>
        )}

        {section === "password" && (
          <section>
            <h2>Cambiar contraseña</h2>
            <p>Formulario para cambiar la contraseña (por implementar).</p>
          </section>
        )}
      </main>
    </div>
  );
}
