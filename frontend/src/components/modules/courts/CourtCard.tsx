//#region MODULES
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Court, SURFACE_LABELS, SPORT_LABELS } from "@/types/court";
import { formatPrice } from "@/utils/formatters";
import styles from "./CourtCard.module.scss";
//#endregion

/**
 * @component CourtCard
 * Tarjeta visual que representa una pista en el listado.
 * Muestra la imagen, deporte, precio de entrada, tipo de superficie,
 * descripción recortada, tabla de precios por duración y botón de reserva.
 *
 * Propiedades:
 *   court → objeto Court con todos los datos de la pista (imagen, nombre, descripción, precios, etc.)
 *
 * Lógica de precio de entrada:
 *   Se muestra el precio correspondiente a la duración mínima reservable.
 *   Si min_unit_min ≤ 60 → price_60 / Si ≤ 90 → price_90 / Si no → price_120
 *
 * Comportamiento:
 *   - Usa la tarifa mínima como precio destacado para la cabecera.
 *   - Muestra el desglose completo de precios para 60, 90 y 120 minutos.
 *   - Mantiene la tarjeta visualmente compacta para el listado general.
 */

//#region TYPES
interface CourtCardProps {
  court: Court;
}
//#endregion

//#region FUNCTIONS
const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
  //#region VARIABLES
  // Calcula el precio principal a mostrar según la duración mínima reservable.
  const entryPrice =
    court.min_unit_min <= 60
      ? court.price_60
      : court.min_unit_min <= 90
        ? court.price_90
        : court.price_120;

  // Traduce la duración mínima a la etiqueta visible en la tarjeta.
  const entryLabel =
    court.min_unit_min <= 60
      ? "60 min"
      : court.min_unit_min <= 90
        ? "90 min"
        : "120 min";
  //#endregion

  return (
    <div className={styles.courtCard}>
      <div className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <Image
            src={court.image_url}
            alt={court.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={styles.sportBadge}>{SPORT_LABELS[court.sport]}</span>
          <div className={styles.priceTag}>
            {formatPrice(entryPrice)}
            <span className={styles.priceLabel}>/{entryLabel}</span>
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.name}>{court.name}</p>
          <p className={styles.surface}>{SURFACE_LABELS[court.surface_type]}</p>

          <p className={styles.desc}>
            {court.description.length > 80
              ? `${court.description.slice(0, 80)}...`
              : court.description}
          </p>

          <div className={styles.prices}>
            <div className={styles.priceItem}>
              <span className={styles.priceDur}>60 min</span>
              <span className={styles.priceVal}>
                {formatPrice(court.price_60)}
              </span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceDur}>90 min</span>
              <span className={styles.priceVal}>
                {formatPrice(court.price_90)}
              </span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceDur}>120 min</span>
              <span className={styles.priceVal}>
                {formatPrice(court.price_120)}
              </span>
            </div>
          </div>

          <button className={styles.bookBtn}>Reservar</button>
        </div>
      </div>
    </div>
  );
};
//#endregion

export default CourtCard;
