import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Court } from '@/types/court';
import styles from './CourtCard.module.scss';

interface CourtCardProps {
    court: Court;
}

const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
        }).format(price);
    };

    const formatTime = (time: string) => {
        return time.slice(0, 5);
    };

    return (
        <div className={styles.courtCard}>
        <Link href={`/courts/${court.id}`} className={styles.cardLink}>
            <div className={styles.imageContainer}>
            <Image
                src={court.image_url}
                alt={court.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className={styles.priceTag}>
                {formatPrice(court.price_hour)}/h
            </div>
            </div>

            <div className={styles.cardContent}>
            <h3 className={styles.courtName}>{court.name}</h3>

            <div className={styles.infoRow}>
                <span className={styles.infoText}>{court.city}</span>
            </div>

            <div className={styles.infoRow}>
                <span className={styles.infoText}>
                {formatTime(court.opening_time)} - {formatTime(court.closing_time)}
                </span>
            </div>

            <div className={styles.infoRow}>
                <span className={styles.infoText}>{court.surface_type}</span>
            </div>

            <p className={styles.description}>
                {court.description.length > 100
                ? `${court.description.slice(0, 100)}...`
                : court.description}
            </p>

            <div className={styles.cardFooter}>
                <span className={styles.address}>{court.address}</span>
                <button className={styles.bookButton}>Reservar</button>
            </div>
            </div>
        </Link>
        </div>
    );
    };

export default CourtCard;