/**
 * formateadores.ts
 * Utilidades de formato para moneda, fechas y texto.
 * Contexto: Costa Rica — CRC (₡), zona horaria America/Costa_Rica
 */

const CONFIGURACION_CRC: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

/**
 * Formatea un número como moneda en Colones costarricenses.
 * @example formatearCRC(15000) → "₡15.000"
 */
export function formatearCRC(monto: number): string {
  return new Intl.NumberFormat('es-CR', CONFIGURACION_CRC).format(monto);
}

/**
 * Formatea una fecha ISO como fecha legible en español.
 * @example formatearFecha("2024-01-15T00:00:00Z") → "15 de enero de 2024"
 */
export function formatearFecha(fecha: string | Date): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Costa_Rica',
  }).format(new Date(fecha));
}

/**
 * Formatea una fecha como fecha y hora legible.
 * @example formatearFechaHora(...) → "15 de enero de 2024, 3:45 p. m."
 */
export function formatearFechaHora(fecha: string | Date): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Costa_Rica',
  }).format(new Date(fecha));
}

/**
 * Convierte un número de mililitros a texto legible.
 * @example formatearVolumen(100) → "100 ml"
 */
export function formatearVolumen(ml: number): string {
  return `${ml} ml`;
}

/**
 * Trunca texto largo a un máximo de caracteres.
 */
export function truncarTexto(texto: string, maximo: number = 80): string {
  if (texto.length <= maximo) return texto;
  return `${texto.slice(0, maximo).trimEnd()}…`;
}
