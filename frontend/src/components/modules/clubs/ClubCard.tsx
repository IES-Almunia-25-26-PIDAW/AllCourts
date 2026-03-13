//#region MODULES
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Club } from "@/types/club";
import styles from "./ClubCard.module.scss";
//#endregion

/**
 * @component ClubCard
 * Tarjeta visual que representa un club en el listado.
 * Muestra el logo, ciudad, nombre, descripción recortada, dirección
 * y el número de pistas disponibles.
 *
 * Props:
 *   club        → objeto Club con los datos del club (type club.ts) (logo, nombre, descripción, etc.)
 *   courtCount  → número de pistas del club (opcional, no se muestra si no se pasa)
 */

//#region TYPES
interface ClubCardProps {
  club: Club;
  courtCount?: number;
}
//#endregion

const ClubCard: React.FC<ClubCardProps> = ({ club, courtCount }) => {
  return (
    <div className={styles.cardLink}>
      <div className={styles.clubCard}>
        <div className={styles.imageContainer}>
          <Image
            src={club.logo_url}
            alt={club.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={styles.cityBadge}>{club.city}</span>
        </div>

        <div className={styles.body}>
          <p className={styles.name}>{club.name}</p>

          <p className={styles.desc}>
            {club.description.length > 90
              ? `${club.description.slice(0, 90)}...`
              : club.description}
          </p>

          <div className={styles.footer}>
            <span className={styles.address}>{club.address}</span>

            {courtCount !== undefined && (
              <span className={styles.count}>
                {courtCount} {courtCount === 1 ? "pista" : "pistas"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
