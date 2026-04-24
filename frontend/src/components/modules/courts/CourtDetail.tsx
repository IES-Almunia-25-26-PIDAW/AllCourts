import Image from "next/image";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
import type { CourtWithClub } from "@/types/court";
import { formatPrice } from "@/utils/formatters";
import styles from "./CourtDetail.module.scss";

interface CourtDetailProps {
    court: CourtWithClub;
}

export default function CourtDetail({ court }: CourtDetailProps) {
    const coverImage = court.image_url || "/logoallcourts.png";

    return (
        <section className={styles.hero}>
            <div className={styles.heroImage}>
                <Image
                    src={coverImage}
                    alt={court.name}
                    fill
                    className={styles.heroImageMedia}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            <div className={styles.heroCopy}>
                <p className={styles.sportTag}>{SPORT_LABELS[court.sport]}</p>

                <h1 className={styles.title}>{court.name}</h1>

                <p className={styles.meta}>
                    {court.club_name ? court.club_name : "Club sin nombre"}
                    {court.city ? ` · ${court.city}` : ""}
                </p>

                <div className={styles.chips}>
                    <span className={styles.chip}>
                        Superficie: {SURFACE_LABELS[court.surface_type]}
                    </span>
                    <span className={styles.chip}>
                        Dirección: {court.address || "No disponible"}
                    </span>
                </div>

                <p className={styles.description}>
                    {court.description || "Sin descripción disponible."}
                </p>

                <div className={styles.priceCard}>
                    <h2 className={styles.priceTitle}>Precios</h2>

                    <div className={styles.priceGrid}>
                        <div className={styles.priceItem}>
                            <p className={styles.priceLabel}>60 min</p>
                            <strong className={styles.priceValue}>
                                {formatPrice(Number(court.price_60))}
                            </strong>
                        </div>
                        <div className={styles.priceItem}>
                            <p className={styles.priceLabel}>90 min</p>
                            <strong className={styles.priceValue}>
                                {formatPrice(Number(court.price_90))}
                            </strong>
                        </div>
                        <div className={styles.priceItem}>
                            <p className={styles.priceLabel}>120 min</p>
                            <strong className={styles.priceValue}>
                                {formatPrice(Number(court.price_120))}
                            </strong>
                        </div>
                    </div>

                    <p className={styles.note}>
                        La reserva se conectará en el siguiente paso.
                    </p>
                </div>
            </div>
        </section>
    );
}
