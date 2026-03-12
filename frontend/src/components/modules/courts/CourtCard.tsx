import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Court, SURFACE_LABELS, SPORT_LABELS } from "@/types/court";
import { formatPrice } from "@/utils/formatters";
import styles from "./CourtCard.module.scss";

interface CourtCardProps {
  court: Court;
}

const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
  const entryPrice =
    court.min_unit_min <= 60
      ? court.price_60
      : court.min_unit_min <= 90
        ? court.price_90
        : court.price_120;

  const entryLabel =
    court.min_unit_min <= 60
      ? "60 min"
      : court.min_unit_min <= 90
        ? "90 min"
        : "120 min";

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

export default CourtCard;
