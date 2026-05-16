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
 * @param price Cantidad numérica a formatear.
 * @returns {string} Precio formateado en EUR.
 */
export const formatPrice = (price: number): string =>
	new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
	}).format(price);

/**
 * Formatea un número como precio en una localización concreta.
 *
 * @param price Cantidad numérica a formatear.
 * @param locale Localización de formato, por defecto `es-ES`.
 * @returns {string} Precio formateado en la localización indicada.
 */
export const formatPriceWithLocale = (
	price: number,
	locale = "es-ES",
): string =>
	new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "EUR",
	}).format(price);

/**
 * Formatea un rango horario a partir de dos cadenas `HH:mm:ss`.
 *
 * @param startTime Hora de inicio.
 * @param endTime Hora de fin.
 * @returns {string} Rango en formato `HH:mm - HH:mm`.
 */
export const formatTimeRange = (startTime: string, endTime: string): string =>
	`${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;

/**
 * Convierte una fecha en formato Date a clave `YYYY-MM-DD`.
 *
 * @param date Fecha de referencia.
 * @returns {string} Clave de fecha normalizada.
 */
export const formatDateKey = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

/**
 * Convierte una clave de fecha `YYYY-MM-DD` en un objeto Date.
 *
 * @param dateKey Clave de fecha a parsear.
 * @returns {Date | undefined} Fecha resultante o `undefined` si es inválida.
 */
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

/**
 * Devuelve la clave de fecha correspondiente al día de referencia.
 *
 * @param referenceDate Fecha de referencia.
 * @returns {string} Clave `YYYY-MM-DD`.
 */
export const getTodayDateKey = (referenceDate = new Date()): string =>
	formatDateKey(referenceDate);

/**
 * Formatea una duración en minutos.
 *
 * @param value Duración en minutos.
 * @returns {string} Texto legible con la duración.
 */
export function formatDurationMinutes(value: string | number): string {
	const minutes = String(value ?? "").trim();
	if (!minutes) {
		return "--";
	}

	return `${minutes} min`;
}

/**
 * Capitaliza la primera letra de un texto.
 *
 * @param value Texto de entrada.
 * @returns {string} Texto con la primera letra en mayúscula.
 */
function capitalize(value: string): string {
	if (!value) {
		return value;
	}

	return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Formatea una fecha larga y la capitaliza para mostrarla en la interfaz.
 *
 * @param dateValue Fecha de entrada.
 * @param locale Localización a usar en el formateo.
 * @param fallbackLabel Etiqueta de respaldo si la fecha no es válida.
 * @returns {string} Fecha formateada o la etiqueta de respaldo.
 */
export function formatLongDate(
	dateValue: string,
	locale: string,
	fallbackLabel: string,
): string {
	if (!dateValue) {
		return fallbackLabel;
	}

	const dateOnly = dateValue.includes("T")
		? dateValue.split("T")[0]
		: dateValue;
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

/**
 * Formatea mes y año con la primera letra capitalizada.
 *
 * @param date Fecha de referencia.
 * @param locale Localización a usar.
 * @returns {string} Texto con mes y año.
 */
export function formatMonthYear(date: Date, locale: string): string {
	const formatted = new Intl.DateTimeFormat(locale, {
		month: "long",
		year: "numeric",
	}).format(date);

	return capitalize(formatted);
}

/**
 * Formatea el día de la semana en formato corto.
 *
 * @param date Fecha de referencia.
 * @param locale Localización a usar.
 * @returns {string} Nombre corto del día.
 */
export function formatWeekdayShort(date: Date, locale: string): string {
	const formatted = new Intl.DateTimeFormat(locale, {
		weekday: "short",
	})
		.format(date)
		.replace(/\./g, "");

	return capitalize(formatted);
}

/**
 * Construye las opciones de duración disponibles para una pista.
 *
 * @param minDuration Duración mínima de la pista.
 * @returns {number[]} Lista ordenada de duraciones disponibles.
 */
export function getDurationOptions(minDuration: number): number[] {
	return Array.from(new Set([minDuration, 60, 90, 120]))
		.filter((duration) => duration >= minDuration)
		.sort((a, b) => a - b);
}

/**
 * Calcula un precio estimado según la duración seleccionada.
 *
 * @param price60 Precio de 60 minutos.
 * @param price90 Precio de 90 minutos.
 * @param price120 Precio de 120 minutos.
 * @param durationMin Duración seleccionada.
 * @returns {number} Precio estimado.
 */
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
