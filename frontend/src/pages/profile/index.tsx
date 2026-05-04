import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { clearAuth } from "@/store/slices/authSlice";
import { logout as logoutRequest } from "@/api/authApi";
import { getBookingsByUserId } from "@/api/bookingApi";
import type { Booking } from "@/types/booking";
import BookingsSection from "@/components/modules/profile/BookingsSection";
import UserInfo from "@/components/modules/profile/UserInfo";
import ChangePassword from "@/components/modules/profile/ChangePassword";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setBookings([]);
      setBookingsLoading(false);
      setBookingsError(null);
      return;
    }

    let cancelled = false;

    const loadBookings = async () => {
      try {
        setBookingsLoading(true);
        setBookingsError(null);

        const data = await getBookingsByUserId(user.id);
        if (!cancelled) {
          setBookings(data);
        }
      } catch (err) {
        if (!cancelled) {
          setBookings([]);
          setBookingsError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar tus reservas.",
          );
        }
      } finally {
        if (!cancelled) {
          setBookingsLoading(false);
        }
      }
    };

    void loadBookings();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

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
        <BookingsSection
          title="Reservas activas"
          bookings={bookings}
          loading={bookingsLoading}
          error={bookingsError}
          emptyMessage="No tienes reservas activas en este momento."
          variant="active"
        />
        <BookingsSection
          title="Reservas pasadas"
          bookings={bookings}
          loading={bookingsLoading}
          error={bookingsError}
          emptyMessage="No tienes reservas pasadas."
          variant="past"
        />
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
