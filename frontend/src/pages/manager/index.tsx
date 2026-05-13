import DashboardCard from '@/components/DashboardCard';
import ClubFormModal from '@/components/modules/manager/ClubFormModal';
import CourtFormModal from '@/components/modules/manager/CourtFormModal';
import CourtScheduleModal from '@/components/modules/manager/CourtScheduleModal';
import { useManagerDashboard } from '@/hooks/useManagerDashboard';
import { useAppDispatch } from '@/store/hooks';
import { deleteClub, deleteCourt } from '@/store/slices/managerSlice';
import { BOOKING_STATUS_LABELS } from '@/types/booking';
import type { Club } from '@/types/club';
import { SPORT_LABELS, SURFACE_LABELS, type Court } from '@/types/court';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

/**
 * @page Manager
 * Panel de control para managers con métricas y listados.
 */
export default function ManagerPage() {
  const { t, i18n } = useTranslation();
  const { user, manager, stats, courts, clubs, bookings, loading, error, isManager } = useManagerDashboard();
  const dispatch = useAppDispatch();
  const [clubModal, setClubModal] = useState<{ open: boolean; club?: Club }>({ open: false });
  const [courtModal, setCourtModal] = useState<{ open: boolean; court?: Court }>({ open: false });
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; court?: Court }>({ open: false });

  const handleDeleteClub = (id: number) => {
    if (window.confirm(t('manager.confirm_delete_club'))) {
      void dispatch(deleteClub(id));
    }
  };

  const handleDeleteCourt = (id: number) => {
    if (window.confirm(t('manager.confirm_delete_court'))) {
      void dispatch(deleteCourt(id));
    }
  };

  if (!user || !isManager) {
    return <div className={styles.loading}>{t('manager.loading')}</div>;
  }

  const currencyLocale = i18n.language.startsWith('en') ? 'en-US' : 'es-ES';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>{t('manager.welcome', { name: user.name })}</h1>
          <div className={styles.email}>{user.email}</div>
        </div>
        <div>
          {manager ? (
            <div className={styles.headerActions}>
              <div className={`${styles.badge} ${manager.subscription_active ? styles.active : styles.inactive}`}>
                {manager.subscription_active ? t('manager.subscription_active') : t('manager.subscription_inactive')}
              </div>
              <Link href="/subscription" className={styles.subscriptionLink}>
                {manager.subscription_active ? t('manager.subscription_manage') : t('manager.subscription_activate')}
              </Link>
            </div>
          ) : (
            <div className={styles.badge + ' ' + styles.inactive}>{t('manager.no_profile')}</div>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>{t('manager.loading_panel')}</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.card}>
              <DashboardCard title={t('manager.stat_courts')} value={stats?.total_courts ?? 0} />
            </div>
            <div className={styles.card}>
              <DashboardCard title={t('manager.stat_bookings')} value={stats?.total_bookings ?? 0} />
            </div>
            <div className={styles.card}>
              <DashboardCard
                title={t('manager.stat_revenue')}
                value={new Intl.NumberFormat(currencyLocale, { style: 'currency', currency: 'EUR' }).format(
                  stats?.total_revenue ?? 0
                )}
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{t('manager.clubs_title')}</span>
              <button className={styles.btnPrimary} onClick={() => setClubModal({ open: true })} type="button">
                {t('manager.clubs_new')}
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('manager.col_name')}</th>
                  <th>{t('manager.col_city')}</th>
                  <th>{t('manager.col_address')}</th>
                  <th>{t('manager.col_actions')}</th>
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
                        {t('manager.btn_edit')}
                      </button>
                      <button className={styles.btnDelete} onClick={() => handleDeleteClub(c.id)} type="button">
                        {t('manager.btn_delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{t('manager.courts_title')}</span>
              <button className={styles.btnPrimary} onClick={() => setCourtModal({ open: true })} type="button">
                {t('manager.courts_new')}
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('manager.col_name')}</th>
                  <th>{t('manager.col_sport')}</th>
                  <th>{t('manager.col_surface')}</th>
                  <th>{t('manager.col_price_60')}</th>
                  <th>{t('manager.col_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {courts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{t(SPORT_LABELS[p.sport])}</td>
                    <td>{t(SURFACE_LABELS[p.surface_type])}</td>
                    <td>{p.price_60}€</td>
                    <td>
                      <button
                        className={styles.btnEdit}
                        onClick={() => setCourtModal({ open: true, court: p })}
                        type="button"
                      >
                        {t('manager.btn_edit')}
                      </button>
                      <button
                        className={styles.btnSchedule}
                        onClick={() => setScheduleModal({ open: true, court: p })}
                        type="button"
                      >
                        {t('manager.btn_schedule')}
                      </button>
                      <button className={styles.btnDelete} onClick={() => handleDeleteCourt(p.id)} type="button">
                        {t('manager.btn_delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>{t('manager.bookings_title')}</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('manager.col_date')}</th>
                  <th>{t('manager.col_court')}</th>
                  <th>{t('manager.col_user')}</th>
                  <th>{t('manager.col_status')}</th>
                  <th>{t('manager.col_price')}</th>
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
                      <span className={`${styles.statusBadge} ${styles[b.status]}`}>
                        {t(BOOKING_STATUS_LABELS[b.status])}
                      </span>
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
