import type { ClubWithManager } from "@/types/club";
import { resolveImageUrl } from "@/utils/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./ClubCard.module.scss";

/**
 * @component ClubCard
 * Tarjeta visual que representa un club en el listado.
 * Muestra el logo, ciudad, nombre, descripción recortada, dirección
 * y el número de pistas disponibles.
 *
 * Propiedades:
 *   club        → objeto con los datos del club (logo, nombre, descripción, etc.)
 *   courtCount  → número de pistas del club (opcional, no se muestra si no se pasa)
 *   href        → ruta de navegación al detalle del club
 *
 * Comportamiento:
 *   - Recorta la descripción para mantener la tarjeta compacta.
 *   - Reutiliza next/image para optimizar la imagen del club.
 *   - Navega al detalle completo al pulsar sobre la tarjeta.
 */

interface ClubCardProps {
	club: ClubWithManager;
	href?: string;
	courtCount?: number;
	variant?: "default" | "detail";
}
const ClubCard = ({
	club,
	href,
	courtCount,
	variant = "default",
}: ClubCardProps) => {
	const { t } = useTranslation();
	const coverImage = resolveImageUrl(club.logo_url);
	const description = club.description || t("clubs.no_description");

	const getArrayLen = (obj: unknown, key: string): number | undefined => {
		const candidate = (obj as any)?.[key];
		return Array.isArray(candidate) ? candidate.length : undefined;
	};

	const courtsCount =
		getArrayLen(club, "courts") ??
		getArrayLen(club, "tracks") ??
		getArrayLen(club, "pitches");
	const showCourtsBadge = typeof courtsCount === "number" && courtsCount >= 0;
	const CardContent = (
		<div
			className={`${styles.clubCard} ${variant === "detail" ? styles.detailCard : ""}`}
		>
			<div
				className={`${styles.imageContainer} ${variant === "detail" ? styles.detailImageContainer : ""}`}
			>
				<Image
					src={coverImage}
					alt={club.name}
					fill
					unoptimized
					className={styles.image}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				{variant !== "detail" && (
					<span className={styles.cityBadge}>
						{club.city || t("clubs.no_city")}
					</span>
				)}
			</div>

			<div className={styles.body}>
				<div className={styles.nameRow}>
					<p className={styles.name}>{club.name}</p>

					{showCourtsBadge && (
						<span className={styles.courtsBadge} aria-hidden>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden
							>
								<rect
									x="3"
									y="6"
									width="18"
									height="12"
									rx="2"
									stroke="currentColor"
									strokeWidth="1.2"
									fill="none"
								/>
								<path
									d="M3 12h18"
									stroke="currentColor"
									strokeWidth="1.2"
								/>
								<circle
									cx="8"
									cy="12"
									r="1"
									fill="currentColor"
								/>
								<circle
									cx="16"
									cy="12"
									r="1"
									fill="currentColor"
								/>
							</svg>
							{courtsCount === 1
								? t("clubs.courts_one", { count: courtsCount })
								: t("clubs.courts_other", {
										count: courtsCount,
									})}
						</span>
					)}
				</div>

				<p className={styles.desc}>
					{description.length > 90
						? `${description.slice(0, 90)}...`
						: description}
				</p>

				<div className={styles.footer}>
					<span className={styles.address}>
						{club.address || t("clubs.no_address")}
					</span>

					{courtCount !== undefined && (
						<span className={styles.count}>
							{courtCount === 1
								? t("clubs.courts_one", { count: courtCount })
								: t("clubs.courts_other", {
										count: courtCount,
									})}
						</span>
					)}
				</div>
			</div>
		</div>
	);

	if (!href) {
		return CardContent;
	}

	return (
		<Link href={href} className={styles.cardLink}>
			{CardContent}
		</Link>
	);
};

export default ClubCard;
