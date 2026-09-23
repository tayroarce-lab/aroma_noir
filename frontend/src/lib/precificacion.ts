/**
 * precificacion.ts
 * Calcula el precio de venta público a partir del costo del proveedor.
 * El costo de proveedor nunca se expone en los datos que consume el frontend
 * (se usa solo para construir el catálogo, no viaja en los objetos Perfume).
 */
export function calcularPrecioVenta(costoProveedorCrc: number, margen = 0.20): number {
  const conMargen = costoProveedorCrc * (1 + margen);
  return Math.ceil(conMargen / 500) * 500;
}
