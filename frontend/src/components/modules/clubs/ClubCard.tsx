//#region MODULES
import Image from "next/image";
import Link from "next/link";
import type { ClubWithManager } from "@/types/club";
import styles from "./ClubCard.module.scss";
//#endregion

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

//#region TYPES
interface ClubCardProps {
  club: ClubWithManager;
  href: string;
  courtCount?: number;
}
//#endregion

//#region FUNCTIONS
const ClubCard = ({ club, href, courtCount }: ClubCardProps) => {
  const coverImage = club.logo_url || "/logoallcourts.png";
  const description = club.description || "Sin descripción disponible.";

  return (
    <Link href={href} className={styles.cardLink}>
      <div className={styles.clubCard}>
        <div className={styles.imageContainer}>
          <Image
            src={coverImage}
            alt={club.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={styles.cityBadge}>{club.city || "Sin ciudad"}</span>
        </div>

        <div className={styles.body}>
          <p className={styles.name}>{club.name}</p>

          <p className={styles.desc}>
            {description.length > 90
              ? `${description.slice(0, 90)}...`
              : description}
          </p>

          <div className={styles.footer}>
            <span className={styles.address}>
              {club.address || "Sin dirección"}
            </span>

            {courtCount !== undefined && (
              <span className={styles.count}>
                {courtCount} {courtCount === 1 ? "pista" : "pistas"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
//#endregion

export default ClubCard;
