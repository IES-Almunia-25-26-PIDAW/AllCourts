import { getCourtsByClubId } from "@/api/courtApi";
import { getCourtSchedulesByCourtId } from "@/api/courtScheduleApi";
import ClubCard from "@/components/modules/clubs/ClubCard";
import CourtCard from "@/components/modules/courts/CourtCard";
import type { ClubWithManager } from "@/types/club";
import { type CourtWithClub } from "@/types/court";
import {
	DAY_KEYS,
	type CourtSchedule,
	type DayOfWeek,
} from "@/types/courtSchedule";
import { formatTimeRange } from "@/utils/formatters";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ClubDetail.module.scss";

interface ClubDetailProps {
	club: ClubWithManager;
}

interface DaySummary {
	dayOfWeek: DayOfWeek;
	label: string;
	detail: string;
}

const WEEK_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

function buildDaySummary(
	daySchedules: CourtSchedule[],
	t: (key: string, options?: Record<string, unknown>) => string,
): Omit<DaySummary, "dayOfWeek"> {
	if (daySchedules.length === 0) {
		return {
			label: t("clubs.detail_no_schedule"),
			detail: t("clubs.detail_consult_club"),
		};
	}

	const openSchedules = daySchedules.filter(
		(schedule) => !schedule.is_closed,
	);
	if (openSchedules.length === 0) {
		return {
			label: t("clubs.detail_closed"),
			detail: t("clubs.detail_all_closed"),
		};
	}

	const uniqueRanges = Array.from(
		new Map(
			openSchedules.map((schedule) => [
				`${schedule.opening_time}-${schedule.closing_time}`,
				formatTimeRange(schedule.opening_time, schedule.closing_time),
			]),
		).values(),
	);

	if (uniqueRanges.length === 1) {
		return {
			label: uniqueRanges[0],
			detail: t("clubs.detail_general_schedule"),
		};
	}

	return {
		label: t("clubs.detail_multiple_schedules", {
			count: uniqueRanges.length,
		}),
		detail: t("clubs.detail_varied_schedule"),
	};
}

/**
 * @component ClubDetail
 * Vista de detalle de un club con sus pistas y horarios semanales.
 *
 * @param club Club a renderizar con información ampliada.
 */
export default function ClubDetail({ club }: ClubDetailProps) {
	const { t } = useTranslation();
	const [courts, setCourts] = useState<CourtWithClub[]>([]);
	const [schedules, setSchedules] = useState<CourtSchedule[]>([]);
	const [loadingCourts, setLoadingCourts] = useState(false);
	const [loadingSchedules, setLoadingSchedules] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadClubData = async () => {
			try {
				setError(null);
				setLoadingCourts(true);
				setLoadingSchedules(true);

				const courtsData = await getCourtsByClubId(club.id);
				const schedulesData = await Promise.all(
					courtsData.map((court) =>
						getCourtSchedulesByCourtId(court.id),
					),
				);

				if (isMounted) {
					setCourts(courtsData);
					setSchedules(schedulesData.flat());
				}
			} catch (err) {
				if (isMounted) {
					setCourts([]);
					setSchedules([]);
					setError(
						err instanceof Error
							? err.message
							: t("clubs.detail_no_courts"),
					);
				}
			} finally {
				if (isMounted) {
					setLoadingCourts(false);
					setLoadingSchedules(false);
				}
			}
		};

		void loadClubData();

		return () => {
			isMounted = false;
		};
	}, [club.id]);

	const sports = Array.from(new Set(courts.map((court) => court.sport)));
	const sportLabels = {
		tenis: t("courts.sport_tenis"),
		padel: t("courts.sport_padel"),
		pickleball: t("courts.sport_pickleball"),
		baloncesto_3x3: t("courts.sport_baloncesto_3x3"),
		baloncesto_5x5: t("courts.sport_baloncesto_5x5"),
		futbol_5: t("courts.sport_futbol_5"),
		futbol_7: t("courts.sport_futbol_7"),
		futbol_11: t("courts.sport_futbol_11"),
		voley: t("courts.sport_voley"),
		balonmano: t("courts.sport_balonmano"),
	} as const;

	const weeklySchedule: DaySummary[] = WEEK_DAYS.map((dayOfWeek) => {
		const daySchedules = schedules.filter(
			(schedule) => schedule.day_of_week === dayOfWeek,
		);

		return {
			dayOfWeek,
			...buildDaySummary(daySchedules, t),
		};
	});

	if (error) {
		return <p className={styles.emptyText}>{error}</p>;
	}

	return (
		<section className={styles.wrapper}>
			<main className={styles.mainColumn}>
				<section className={styles.heroCard}>
					<ClubCard
						club={club}
						courtCount={courts.length}
						variant="detail"
					/>
				</section>

				<section className={styles.sectionCard}>
					<header className={styles.sectionHeader}>
						<span className={styles.sectionEyebrow}>
							{t("clubs.detail_section_courts")}
						</span>
						<span className={styles.sectionSummary}>
							{loadingCourts
								? t("clubs.detail_loading_courts")
								: courts.length
									? courts.length === 1
										? t("clubs.courts_one", {
												count: courts.length,
											})
										: t("clubs.courts_other", {
												count: courts.length,
											})
									: t("clubs.detail_no_courts")}
						</span>
					</header>

					{courts.length === 0 ? (
						<p className={styles.emptyText}>
							{t("clubs.detail_add_courts")}
						</p>
					) : (
						<section className={styles.courtsGrid}>
							{courts.map((court) => (
								<CourtCard key={court.id} court={court} />
							))}
						</section>
					)}
				</section>
			</main>

			<aside className={styles.sidebar}>
				<section className={styles.sideCard}>
					<header className={styles.sectionHeader}>
						<span className={styles.sectionEyebrow}>
							{t("clubs.detail_section_sports")}
						</span>
						<span className={styles.sideNote}>
							{sports.length
								? t("clubs.detail_active_sports", {
										count: sports.length,
									})
								: t("clubs.detail_no_sports")}
						</span>
					</header>

					{sports.length > 0 ? (
						<ul className={styles.tagsList}>
							{sports.map((sport) => (
								<li key={sport} className={styles.tagItem}>
									{
										sportLabels[
											sport as keyof typeof sportLabels
										]
									}
								</li>
							))}
						</ul>
					) : null}
				</section>

				<section className={styles.sideCard}>
					<header className={styles.sectionHeader}>
						<span className={styles.sectionEyebrow}>
							{t("clubs.detail_section_schedule")}
						</span>
						<span className={styles.sideNote}>
							{loadingSchedules
								? t("clubs.detail_loading_schedules")
								: t("clubs.detail_week_complete")}
						</span>
					</header>

					<ul className={styles.scheduleList}>
						{weeklySchedule.map((day) => (
							<li
								key={day.dayOfWeek}
								className={styles.scheduleItem}
							>
								<span className={styles.dayName}>
									{t(DAY_KEYS[day.dayOfWeek])}
								</span>
								<span className={styles.dayLabel}>
									{day.label}
								</span>
							</li>
						))}
					</ul>
				</section>
			</aside>
		</section>
	);
}
