/**
 * @module formatters
 * Colección de funciones para formatear datos en toda la app.
 * Centraliza la lógica de presentación de datos para garantizar consistencia
 * visual en precios, fechas, números y cualquier otro valor formateado.
 */

/**
 * Formatea un número como precio en euros con el formato local español.
 * Ejemplo: 1500 → "1.500,00 €"
 *
 * @param price - Cantidad numérica a formatear
 * @returns String con el precio formateado en EUR (ej: "25,00 €")
 */
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);

//! Añadir documentaciones de métodos
export const formatPriceWithLocale = (
  price: number,
  locale = "es-ES",
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);

export const formatTimeRange = (startTime: string, endTime: string): string =>
  `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;

export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function parseDateKey(dateKey: string): Date | undefined {
  if (!dateKey) {
    return undefined;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

export const getTodayDateKey = (referenceDate = new Date()): string =>
  formatDateKey(referenceDate);

export function formatDurationMinutes(value: string | number): string {
  const minutes = String(value ?? "").trim();
  if (!minutes) {
    return "--";
  }

  return `${minutes} min`;
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatLongDate(
  dateValue: string,
  locale: string,
  fallbackLabel: string,
): string {
  if (!dateValue) {
    return fallbackLabel;
  }

  const dateOnly = dateValue.includes("T") ? dateValue.split("T")[0] : dateValue;
  const date = new Date(`${dateOnly}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return fallbackLabel;
  }

  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return capitalize(formatted);
}

export function formatMonthYear(date: Date, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);

  return capitalize(formatted);
}

export function formatWeekdayShort(date: Date, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  })
    .format(date)
    .replace(/\./g, "");

  return capitalize(formatted);
}

export function getDurationOptions(minDuration: number): number[] {
  return Array.from(new Set([minDuration, 60, 90, 120]))
    .filter((duration) => duration >= minDuration)
    .sort((a, b) => a - b);
}

export function calculateEstimatedPrice(
  price60: number,
  price90: number,
  price120: number,
  durationMin: number,
): number {
  if (durationMin === 60) return Number(price60);
  if (durationMin === 90) return Number(price90);
  if (durationMin === 120) return Number(price120);

  return Number(((Number(price60) / 60) * durationMin).toFixed(2));
}
