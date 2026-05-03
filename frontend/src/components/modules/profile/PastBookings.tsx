import styles from "./PastBookings.module.scss";

export default function PastBookings() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Reservas pasadas</h2>
      <div className={styles.empty}>
        <p>No tienes reservas pasadas en este momento.</p>
      </div>
    </section>
  );
}
