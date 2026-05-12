import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCourtSchedules, saveCourtSchedules, selectSchedulesByCourtId } from '@/store/slices/managerSlice';
import type { Court } from '@/types/court';
import { DAY_LABELS, type DayOfWeek } from '@/types/courtSchedule';
import { useEffect, useState } from 'react';
import styles from './CourtScheduleModal.module.scss';

type DaySchedule = {
  day_of_week: DayOfWeek;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
};

const DEFAULT_SCHEDULE: Omit<DaySchedule, 'day_of_week'> = {
  opening_time: '09:00',
  closing_time: '21:00',
  is_closed: false
};

const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

type CourtScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  court: Court;
};

export default function CourtScheduleModal({ isOpen, onClose, court }: CourtScheduleModalProps) {
  const dispatch = useAppDispatch();
  const schedulesByCourtId = useAppSelector(selectSchedulesByCourtId);
  const existingSchedules = schedulesByCourtId[court.id] ?? [];

  const buildInitialRows = (): DaySchedule[] =>
    ALL_DAYS.map((day) => {
      const existing = existingSchedules.find((s) => s.day_of_week === day);
      return existing
        ? {
            day_of_week: day,
            opening_time: existing.opening_time,
            closing_time: existing.closing_time,
            is_closed: existing.is_closed
          }
        : { day_of_week: day, ...DEFAULT_SCHEDULE };
    });

  const [rows, setRows] = useState<DaySchedule[]>(buildInitialRows);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      void dispatch(fetchCourtSchedules(court.id));
      setFormError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, court.id, dispatch]);

  useEffect(() => {
    setRows(buildInitialRows());
  }, [existingSchedules]);

  if (!isOpen) return null;

  const updateRow = (day: DayOfWeek, field: keyof Omit<DaySchedule, 'day_of_week'>, value: string | boolean) => {
    setRows((prev) => prev.map((r) => (r.day_of_week === day ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setSuccessMsg(null);
    try {
      await dispatch(saveCourtSchedules({ courtId: court.id, schedules: rows })).unwrap();
      setSuccessMsg('Horarios guardados correctamente');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudieron guardar los horarios');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Horarios — {court.name}</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        {formError && <p className={styles.errorMsg}>{formError}</p>}
        {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.tableWrapper}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Apertura</th>
                  <th>Cierre</th>
                  <th>Cerrado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.day_of_week} className={row.is_closed ? styles.rowClosed : ''}>
                    <td className={styles.dayLabel}>{DAY_LABELS[row.day_of_week]}</td>
                    <td>
                      <input
                        className={styles.timeInput}
                        type="time"
                        value={row.opening_time}
                        disabled={row.is_closed}
                        onChange={(e) => updateRow(row.day_of_week, 'opening_time', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.timeInput}
                        type="time"
                        value={row.closing_time}
                        disabled={row.is_closed}
                        onChange={(e) => updateRow(row.day_of_week, 'closing_time', e.target.value)}
                      />
                    </td>
                    <td className={styles.checkCell}>
                      <input
                        type="checkbox"
                        checked={row.is_closed}
                        onChange={(e) => updateRow(row.day_of_week, 'is_closed', e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar horarios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
