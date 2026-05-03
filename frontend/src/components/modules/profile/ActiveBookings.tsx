import styles from "./ActiveBookings.module.scss";

export default function ActiveBookings() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Reservas activas</h2>
      <div className={styles.empty}>
        <p>No tienes reservas activas en este momento.</p>
      </div>
    </section>
  );
}
