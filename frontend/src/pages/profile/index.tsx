import { useState } from "react";
import styles from "./index.module.scss";
import BookingsSection from "@/components/modules/profile/BookingsSection";
import UserInfo from "@/components/modules/profile/UserInfo";
import ChangePassword from "@/components/modules/profile/ChangePassword";
import { useAuth } from "@/hooks/useAuth";
import { useProfileBookings } from "@/hooks/useProfileBookings";

export default function ProfilePage() {
	const { logout, user } = useAuth();
	const { bookings, loading: bookingsLoading, error: bookingsError } = useProfileBookings(user?.id);

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
							{(user?.name || user?.username || "U")
								.slice(0, 1)
								.toUpperCase()}
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
					<button onClick={logout} className={styles.logoutBtn}>
						Cerrar sesión
					</button>
				</section>
			</main>
		</div>
	);
}
