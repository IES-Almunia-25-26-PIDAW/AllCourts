import DashboardCard from '@/components/DashboardCard';
import ClubFormModal from '@/components/modules/manager/ClubFormModal';
import CourtFormModal from '@/components/modules/manager/CourtFormModal';
import CourtScheduleModal from '@/components/modules/manager/CourtScheduleModal';
import { useManagerDashboard } from '@/hooks/useManagerDashboard';
import { useAppDispatch } from '@/store/hooks';
import { deleteClub, deleteCourt } from '@/store/slices/managerSlice';
import type { Club } from '@/types/club';
import type { Court } from '@/types/court';
import Link from 'next/link';
import { useState } from 'react';
import styles from './index.module.scss';

/**
 * @page Manager
 * Panel de control para managers con métricas y listados.
 */
export default function ManagerPage() {
  const { user, manager, stats, courts, clubs, bookings, loading, error, isManager } = useManagerDashboard();
  const dispatch = useAppDispatch();
  const [clubModal, setClubModal] = useState<{ open: boolean; club?: Club }>({ open: false });
  const [courtModal, setCourtModal] = useState<{ open: boolean; court?: Court }>({ open: false });
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; court?: Court }>({ open: false });

  const handleDeleteClub = (id: number) => {
    if (window.confirm('¿Seguro que quieres eliminar este club? También se eliminarán sus pistas.')) {
      void dispatch(deleteClub(id));
    }
  };

  const handleDeleteCourt = (id: number) => {
    if (window.confirm('¿Seguro que quieres eliminar esta pista?')) {
      void dispatch(deleteCourt(id));
    }
  };

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
            <div className={styles.headerActions}>
              <div className={`${styles.badge} ${manager.subscription_active ? styles.active : styles.inactive}`}>
                {manager.subscription_active ? 'Suscripción activa' : 'Suscripción inactiva'}
              </div>
              <Link href="/subscription" className={styles.subscriptionLink}>
                {manager.subscription_active ? 'Gestionar suscripción' : 'Activar suscripción'}
              </Link>
            </div>
          ) : (
            <div className={styles.badge + ' ' + styles.inactive}>Sin perfil</div>
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
                value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                  stats?.total_revenue ?? 0
                )}
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Mis Clubs</span>
              <button className={styles.btnPrimary} onClick={() => setClubModal({ open: true })} type="button">
                + Nuevo club
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ciudad</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.city}</td>
                    <td>{c.address}</td>
                    <td>
                      <button
                        className={styles.btnEdit}
                        onClick={() => setClubModal({ open: true, club: c })}
                        type="button"
                      >
                        Editar
                      </button>
                      <button className={styles.btnDelete} onClick={() => handleDeleteClub(c.id)} type="button">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Mis Pistas</span>
              <button className={styles.btnPrimary} onClick={() => setCourtModal({ open: true })} type="button">
                + Nueva pista
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Deporte</th>
                  <th>Superficie</th>
                  <th>Precio 60min</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sport}</td>
                    <td>{p.surface_type}</td>
                    <td>{p.price_60}€</td>
                    <td>
                      <button
                        className={styles.btnEdit}
                        onClick={() => setCourtModal({ open: true, court: p })}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className={styles.btnSchedule}
                        onClick={() => setScheduleModal({ open: true, court: p })}
                        type="button"
                      >
                        Horario
                      </button>
                      <button className={styles.btnDelete} onClick={() => handleDeleteCourt(p.id)} type="button">
                        Eliminar
                      </button>
                    </td>
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
                      {b.date} {b.start_time ? ` ${b.start_time}` : ''}
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

          <ClubFormModal
            isOpen={clubModal.open}
            onClose={() => setClubModal({ open: false })}
            club={clubModal.club}
            managerId={manager?.id ?? ''}
          />
          <CourtFormModal
            isOpen={courtModal.open}
            onClose={() => setCourtModal({ open: false })}
            court={courtModal.court}
            clubs={clubs}
          />
          {scheduleModal.court && (
            <CourtScheduleModal
              isOpen={scheduleModal.open}
              onClose={() => setScheduleModal({ open: false })}
              court={scheduleModal.court}
            />
          )}
        </>
      )}
    </div>
  );
}
