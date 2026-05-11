import DashboardCard from "@/components/DashboardCard";
import { useManagerDashboard } from "@/hooks/useManagerDashboard";
import styles from "./index.module.scss";

export default function ManagerPage() {
  const { user, manager, stats, courts, clubs, bookings, loading, error, isManager } = useManagerDashboard();

  if (!user || !isManager) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Bienvenido, {user.name}</h1>
          <div className={styles.email}>{user.email}</div>
        </div>
        <div>
          {manager ? (
            <div className={`${styles.badge} ${manager.subscription_active ? styles.active : styles.inactive}`}>
              {manager.subscription_active ? "Suscripción activa" : "Suscripción inactiva"}
            </div>
          ) : (
            <div className={styles.badge + " " + styles.inactive}>Sin perfil</div>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando datos del panel...</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.card}>
              <DashboardCard title="Pistas" value={stats?.total_courts ?? 0} />
            </div>
            <div className={styles.card}>
              <DashboardCard title="Reservas" value={stats?.total_bookings ?? 0} />
            </div>
            <div className={styles.card}>
              <DashboardCard
                title="Ingresos"
                value={new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
                  stats?.total_revenue ?? 0,
                )}
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Mis Clubs</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ciudad</th>
                  <th>Dirección</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.city}</td>
                    <td>{c.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Mis Pistas</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Deporte</th>
                  <th>Superficie</th>
                  <th>Precio 60min</th>
                </tr>
              </thead>
              <tbody>
                {courts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sport}</td>
                    <td>{p.surface_type}</td>
                    <td>{p.price_60}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Reservas</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Pista</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      {b.date} {b.start_time ? ` ${b.start_time}` : ""}
                    </td>
                    <td>{b.court_name}</td>
                    <td>{b.user_name}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[b.status]}`}>{b.status}</span>
                    </td>
                    <td>{b.total_price}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

