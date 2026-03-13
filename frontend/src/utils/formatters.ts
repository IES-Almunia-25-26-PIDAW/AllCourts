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