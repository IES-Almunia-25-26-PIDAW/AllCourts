import {
  calculateEstimatedPrice,
  formatDateKey,
  formatDurationMinutes,
  formatLongDate,
  formatMonthYear,
  formatPrice,
  formatPriceWithLocale,
  formatTimeRange,
  formatWeekdayShort,
  getDurationOptions,
  getTodayDateKey,
  parseDateKey,
} from '../formatters';

describe('formatters', () => {
  it('formats prices and time ranges', () => {
    expect(formatPrice(1500)).toContain('€');
    expect(formatPrice(1500)).toMatch(/1500,00/);
    expect(formatPriceWithLocale(1500, 'en-US')).toContain('€');
    expect(formatPriceWithLocale(1500, 'en-US')).toMatch(/1,500\.00/);
    expect(formatTimeRange('08:30:00', '10:00:00')).toBe('08:30 - 10:00');
  });

  it('formats and parses date keys', () => {
    const date = new Date(2026, 4, 15);

    expect(formatDateKey(date)).toBe('2026-05-15');
    expect(parseDateKey('2026-05-15')).toEqual(date);
    expect(parseDateKey('')).toBeUndefined();
    expect(getTodayDateKey(date)).toBe('2026-05-15');
  });

  it('formats duration and calendar labels', () => {
    const date = new Date(2026, 4, 15);

    expect(formatDurationMinutes(90)).toBe('90 min');
    expect(formatDurationMinutes('')).toBe('--');
    expect(formatMonthYear(date, 'es-ES')).toContain('2026');
    expect(formatWeekdayShort(date, 'es-ES')).not.toBe('');
    expect(formatLongDate('2026-05-15', 'es-ES', 'fallback')).toContain('2026');
    expect(formatLongDate('', 'es-ES', 'fallback')).toBe('fallback');
  });

  it('builds duration options and estimated prices', () => {
    expect(getDurationOptions(45)).toEqual([45, 60, 90, 120]);
    expect(getDurationOptions(90)).toEqual([90, 120]);
    expect(calculateEstimatedPrice(20, 30, 40, 60)).toBe(20);
    expect(calculateEstimatedPrice(20, 30, 40, 90)).toBe(30);
    expect(calculateEstimatedPrice(20, 30, 40, 75)).toBe(25);
  });
});
