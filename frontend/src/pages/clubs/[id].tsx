import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getClubById } from "@/api/clubApi";
import ClubDetail from "../../components/modules/clubs/ClubDetail";
import type { ClubWithManager } from "@/types/club";
import styles from "./[id].module.scss";

//#region DOCUMENTATION
/**
 * @page ClubDetail
 * Vista de detalle de un club.
 * Muestra la información principal del club, un resumen de sus pistas y acceso de vuelta al listado.
 *
 * Secciones:
 *   Hero       → imagen principal, nombre, ciudad y descripción
 *   CourtsCard  → listado de pistas relacionadas con acceso a su detalle
 *   BackLink    → navegación de retorno al listado de clubes
 */
//#endregion

//#region FUNCTIONS
export default function ClubDetailPage() {
	const router = useRouter();
	const [club, setClub] = useState<ClubWithManager | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const clubId = Array.isArray(router.query.id)
		? router.query.id[0]
		: router.query.id;

	useEffect(() => {
		if (!router.isReady || !clubId) {
			return;
		}

		// Cargamos el club y sus pistas a la vez para mantener la vista sincronizada.
		const loadClub = async () => {
			try {
				setLoading(true);
				setError(null);

				const clubData = await getClubById(clubId);

				setClub(clubData);
			} catch (err) {
				setClub(null);
				setError(
					err instanceof Error
						? err.message
						: "No se pudo cargar el club.",
				);
			} finally {
				setLoading(false);
			}
		};

		void loadClub();
	}, [router.isReady, clubId]);

	if (loading) {
		return (
			<main className={styles.page}>
				<p className={styles.status}>Cargando club...</p>
			</main>
		);
	}

	if (error || !club) {
		return (
			<main className={styles.page}>
				<p className={styles.errorText}>{error}</p>
				<a href="/clubs" className={styles.backLink}>
					Volver al listado
				</a>
			</main>
		);
	}

	return (
		<main className={styles.page}>
			<div className={styles.detailNav}>
				<Link href="/clubs" className={styles.backLink}>
					← Volver a clubes
				</Link>

				<Link href="/courts" className={styles.secondaryLink}>
					Ver todas las pistas
				</Link>
			</div>

			<ClubDetail club={club} />
		</main>
	);
}
//#endregion
