import { useEffect, useState } from "react";
import ClubCard from "@/components/modules/clubs/ClubCard";
import CourtCard from "@/components/modules/courts/CourtCard";
import { getCourtsByClubId } from "@/api/courtApi";
import { getCourtSchedulesByCourtId } from "@/api/courtScheduleApi";
import { formatTimeRange } from "@/utils/formatters";
import { DAY_LABELS, type DayOfWeek, type CourtSchedule } from "@/types/courtSchedule";
import { SPORT_LABELS, type CourtWithClub } from "@/types/court";
import type { ClubWithManager } from "@/types/club";
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
): Omit<DaySummary, "dayOfWeek"> {
	if (daySchedules.length === 0) {
		return {
			label: "Sin horario publicado",
			detail: "Consulta con el club.",
		};
	}

	const openSchedules = daySchedules.filter(
		(schedule) => !schedule.is_closed,
	);
	if (openSchedules.length === 0) {
		return {
			label: "Cerrado",
			detail: "Todas las pistas cierran este día.",
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
		return { label: uniqueRanges[0], detail: "Horario general del club." };
	}

	return {
		label: `${uniqueRanges.length} horarios distintos`,
		detail: "Los horarios varían según la pista.",
	};
}

export default function ClubDetail({ club }: ClubDetailProps) {
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
							: "No se pudo cargar el detalle del club.",
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

	const weeklySchedule: DaySummary[] = WEEK_DAYS.map((dayOfWeek) => {
		const daySchedules = schedules.filter(
			(schedule) => schedule.day_of_week === dayOfWeek,
		);

		return {
			dayOfWeek,
			...buildDaySummary(daySchedules),
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
						<span className={styles.sectionEyebrow}>Pistas</span>
						<span className={styles.sectionSummary}>
							{loadingCourts
								? "Cargando pistas..."
								: courts.length
									? `${courts.length} pista${courts.length === 1 ? "" : "s"} disponible${courts.length === 1 ? "" : "s"}.`
									: "Este club todavía no tiene pistas cargadas."}
						</span>
					</header>

					{courts.length === 0 ? (
						<p className={styles.emptyText}>
							Añade pistas para mostrar reservas, deportes y
							precios en este club.
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
						<span className={styles.sectionEyebrow}>Deportes</span>
						<span className={styles.sideNote}>
							{sports.length
								? `${sports.length} modalidades activas.`
								: "Sin deportes publicados todavía."}
						</span>
					</header>

					{sports.length > 0 ? (
						<ul className={styles.tagsList}>
							{sports.map((sport) => (
								<li key={sport} className={styles.tagItem}>
									{SPORT_LABELS[sport]}
								</li>
							))}
						</ul>
					) : null}
				</section>

				<section className={styles.sideCard}>
					<header className={styles.sectionHeader}>
						<span className={styles.sectionEyebrow}>Horario</span>
						<span className={styles.sideNote}>
							{loadingSchedules
								? "Cargando horarios..."
								: "Semana completa, resumida por día."}
						</span>
					</header>

					<ul className={styles.scheduleList}>
						{weeklySchedule.map((day) => (
							<li
								key={day.dayOfWeek}
								className={styles.scheduleItem}
							>
								<span className={styles.dayName}>
									{DAY_LABELS[day.dayOfWeek]}
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
