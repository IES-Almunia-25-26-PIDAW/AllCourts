import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { clearAuth } from "@/store/slices/authSlice";
import { logout as logoutRequest } from "@/api/authApi";
import ActiveBookings from "@/components/modules/profile/ActiveBookings";
import PastBookings from "@/components/modules/profile/PastBookings";
import UserInfo from "@/components/modules/profile/UserInfo";
import ChangePassword from "@/components/modules/profile/ChangePassword";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    (async () => {
      try {
        await logoutRequest();
      } catch {}
      try {
        window.localStorage.removeItem("allcourts_user");
      } catch {}
      dispatch(clearAuth());
      router.push("/");
    })();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerProfile}>
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="avatar"
              className={styles.headerAvatar}
            />
          ) : (
            <div className={styles.headerAvatarPlaceholder}>
              {(user?.name || user?.username || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className={styles.headerInfo}>
            <h1 className={styles.headerUsername}>
              {user?.username || "Usuario"}
            </h1>
            <p className={styles.headerEmail}>{user?.email}</p>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <ActiveBookings />
        <PastBookings />
        <div className={styles.formsSide}>
          <UserInfo />
          <ChangePassword />
        </div>

        <section className={styles.logoutSection}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </section>
      </main>
    </div>
  );
}
