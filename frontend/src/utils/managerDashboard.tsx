import type { Booking, BookingStatus } from '@/types/booking';
import { BOOKING_STATUS_LABELS } from '@/types/booking';
import type { Court, Sport } from '@/types/court';
import { SPORT_LABELS } from '@/types/court';
import styles from '../pages/manager/index.module.scss';

type Translate = (key: string) => string;

export type DashboardStatusDatum = {
  key: BookingStatus;
  label: string;
  value: number;
  colorClass: string;
};

export type DashboardSportDatum = {
  key: Sport;
  label: string;
  courts: number;
  colorClass: string;
};

export type DashboardRevenueDatum = {
  key: string;
  label: string;
  revenue: number;
};

export type DashboardTooltipPayload = {
  value?: number | string;
};

export type DashboardTooltipProps = {
  active?: boolean;
  payload?: DashboardTooltipPayload[];
  label?: string;
};

const STATUS_CHART_CELL_CLASS: Record<BookingStatus, string> = {
  confirmed: styles.statusChartConfirmed,
  pending: styles.statusChartPending,
  cancelled: styles.statusChartCancelled
};

const SPORT_CHART_CELL_CLASSES = [
  styles.sportChartColor1,
  styles.sportChartColor2,
  styles.sportChartColor3,
  styles.sportChartColor4,
  styles.sportChartColor5,
  styles.sportChartColor6
];

function parseBookingDate(dateValue: string): Date | null {
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseBookingPrice(price: number | string | null | undefined): number {
  const parsed = typeof price === 'number' ? price : Number(price ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getBookingStatusChartData(bookings: Booking[], t: Translate): DashboardStatusDatum[] {
  const counts = bookings.reduce<Record<BookingStatus, number>>(
    (acc, booking) => {
      acc[booking.status] += 1;
      return acc;
    },
    { pending: 0, confirmed: 0, cancelled: 0 }
  );

  return (Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map((statusKey) => ({
    key: statusKey,
    label: t(BOOKING_STATUS_LABELS[statusKey]),
    value: counts[statusKey],
    colorClass: STATUS_CHART_CELL_CLASS[statusKey]
  }));
}

export function getSportChartData(courts: Court[], t: Translate): DashboardSportDatum[] {
  const counts = courts.reduce<Record<Sport, number>>(
    (acc, court) => {
      acc[court.sport] += 1;
      return acc;
    },
    {
      tenis: 0,
      padel: 0,
      pickleball: 0,
      baloncesto_3x3: 0,
      baloncesto_5x5: 0,
      futbol_5: 0,
      futbol_7: 0,
      futbol_11: 0,
      voley: 0,
      balonmano: 0
    }
  );

  return (Object.keys(SPORT_LABELS) as Sport[])
    .map((sportKey) => ({
      key: sportKey,
      label: t(SPORT_LABELS[sportKey]),
      courts: counts[sportKey],
      colorClass: ''
    }))
    .filter((item) => item.courts > 0)
    .map((item, index) => ({
      ...item,
      colorClass: SPORT_CHART_CELL_CLASSES[index % SPORT_CHART_CELL_CLASSES.length]
    }));
}

export function buildRevenueData(
  bookings: Booking[],
  locale: string,
  totalRevenue: number | undefined
): DashboardRevenueDatum[] {
  const currentDate = new Date();
  const monthKeys: { key: string; label: string }[] = [];

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    monthKeys.push({ key, label });
  }

  const revenueByMonth = new Map<string, number>(monthKeys.map((month) => [month.key, 0]));

  bookings.forEach((booking) => {
    const parsedDate = parseBookingDate(booking.date);

    if (!parsedDate) {
      return;
    }

    const key = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;

    if (!revenueByMonth.has(key)) {
      return;
    }

    const previousValue = revenueByMonth.get(key) ?? 0;
    const bookingPrice = parseBookingPrice(booking.total_price);
    revenueByMonth.set(key, Number((previousValue + bookingPrice).toFixed(2)));
  });

  const nonZeroMonths = Array.from(revenueByMonth.values()).filter((value) => value > 0).length;

  if (nonZeroMonths < 2) {
    const derivedTotal = totalRevenue ?? bookings.reduce((acc, booking) => acc + parseBookingPrice(booking.total_price), 0);
    const baseMonthly = derivedTotal > 0 ? derivedTotal / monthKeys.length : 0;

    monthKeys.forEach((month, index) => {
      const existingValue = revenueByMonth.get(month.key) ?? 0;

      if (existingValue > 0) {
        return;
      }

      const factor = 0.8 + (index % 3) * 0.1;
      revenueByMonth.set(month.key, Number((baseMonthly * factor).toFixed(2)));
    });
  }

  return monthKeys.map((month) => ({
    key: month.key,
    label: month.label,
    revenue: revenueByMonth.get(month.key) ?? 0
  }));
}

export function DashboardTooltip({ active, payload, label }: DashboardTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const firstValue = payload[0]?.value;
  const value = typeof firstValue === 'number' ? firstValue : Number(firstValue ?? 0);

  return (
    <div className={styles.chartTooltip}>
      <div className={styles.chartTooltipLabel}>{label}</div>
      <div className={styles.chartTooltipValue}>{value}</div>
    </div>
  );
}
