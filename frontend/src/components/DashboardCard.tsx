import React from "react";
import styles from "@/components/DashboardCard.module.scss";

type Props = {
	title: string;
	value: string | number;
	icon?: string;
	subtitle?: string;
	className?: string;
};

/**
 * @component DashboardCard
 * Tarjeta compacta para mostrar una métrica o resumen en paneles.
 *
 * @param title Texto principal de la tarjeta.
 * @param value Valor destacado que se quiere mostrar.
 * @param icon Icono opcional para reforzar el contexto visual.
 * @param subtitle Texto secundario opcional.
 * @param className Clases adicionales para adaptar el estilo.
 */
export default function DashboardCard({
	title,
	value,
	icon,
	subtitle,
	className,
}: Props) {
	return (
		<div className={`${styles.card} ${className ?? ""}`.trim()}>
			<div className={styles.inner}>
				<div className={styles.row}>
					<div>
						<div className={styles.title}>{title}</div>
						<div className={styles.value}>{value}</div>
					</div>
					{icon ? (
						<div className={styles.icon} aria-hidden>
							{icon}
						</div>
					) : null}
				</div>
				{subtitle ? (
					<div className={styles.subtitle}>{subtitle}</div>
				) : null}
			</div>
		</div>
	);
}
