/**
 * coloresAcordes.ts
 * Mapa de color por acorde principal, al estilo de las gráficas de
 * "acordes principales" de las fichas de perfumería (cada tipo de acorde
 * tiene un color reconocible). Si un acorde no está en el mapa, se usa
 * el color de respaldo (ámbar de la marca).
 */

export const COLOR_ACORDE_RESPALDO = '#C98A3B';

export const COLORES_ACORDES: Record<string, string> = {
  Amaderado: '#8B5A2B',
  Aromático: '#2F9E8F',
  Ámbar: '#C9752B',
  Cítrico: '#D4C430',
  Fresco: '#4E9A51',
  Floral: '#E187B5',
  Frutal: '#E0574A',
  Dulce: '#B8449C',
  Gourmand: '#A5673A',
  Almizclado: '#B7A99A',
  Especiado: '#C1432A',
  Oriental: '#6B3FA0',
  Acuático: '#3E8FB0',
  Verde: '#6FA83C',
  Vainilla: '#D9B466',
  Cuero: '#6E4B3A',
};

export function colorDeAcorde(nombre: string): string {
  return COLORES_ACORDES[nombre] ?? COLOR_ACORDE_RESPALDO;
}
