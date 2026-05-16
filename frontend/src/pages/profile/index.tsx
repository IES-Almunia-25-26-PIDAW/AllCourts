import BookingsSection from "@/components/modules/profile/BookingsSection";
import ChangePassword from "@/components/modules/profile/ChangePassword";
import UserInfo from "@/components/modules/profile/UserInfo";
import { useAuth } from "@/hooks/useAuth";
import { useProfileBookings } from "@/hooks/useProfileBookings";
import type { Booking } from "@/types/booking";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

/**
 * @page Profile
 * Área privada con datos de usuario y reservas.
 */
export default function ProfilePage() {
	const { logout, user } = useAuth();
	const { t } = useTranslation();
	const {
		bookings,
		loading: bookingsLoading,
		error: bookingsError,
	} = useProfileBookings(user?.id);
	const [profileBookings, setProfileBookings] = useState<Booking[]>([]);

	useEffect(() => {
		setProfileBookings(bookings);
	}, [bookings]);

	const handleBookingStatusChange = (
		bookingId: number,
		updates: Partial<Booking>,
	) => {
		setProfileBookings((prev) =>
			prev.map((booking) =>
				booking.id === bookingId ? { ...booking, ...updates } : booking,
			),
		);
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
							{(
								user?.name ||
								user?.username ||
								t("profile.default_username")
							)
								.slice(0, 1)
								.toUpperCase()}
						</div>
					)}
					<div className={styles.headerInfo}>
						<h1 className={styles.headerUsername}>
							{user?.username || t("profile.default_username")}
						</h1>
						<p className={styles.headerEmail}>{user?.email}</p>
					</div>
				</div>
			</header>

			<main className={styles.content}>
				<BookingsSection
					title={t("profile.active_bookings_title")}
					bookings={profileBookings}
					loading={bookingsLoading}
					error={bookingsError}
					emptyMessage={t("profile.active_bookings_empty")}
					variant="active"
					onBookingStatusChange={handleBookingStatusChange}
				/>
				<BookingsSection
					title={t("profile.past_bookings_title")}
					bookings={profileBookings}
					loading={bookingsLoading}
					error={bookingsError}
					emptyMessage={t("profile.past_bookings_empty")}
					variant="past"
					onBookingStatusChange={handleBookingStatusChange}
				/>
				<div className={styles.formsSide}>
					<UserInfo />
					<ChangePassword />
				</div>

				<section className={styles.logoutSection}>
					<button onClick={logout} className={styles.logoutBtn}>
						{t("profile.logout")}
					</button>
				</section>
			</main>
		</div>
	);
}
