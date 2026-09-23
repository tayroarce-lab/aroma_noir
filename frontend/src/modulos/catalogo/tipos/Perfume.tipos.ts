/**
 * Perfume.tipos.ts
 * Tipos TypeScript centrales derivados del esquema Prisma.
 * Estos tipos son la fuente de verdad para el frontend.
 */

// ─── Enumeraciones de dominio ──────────────────────────────────────────────

export type ClasificacionPerfume = 'Arabe' | 'Nicho' | 'Diseñador';

export type GeneroPerfume = 'Masculino' | 'Femenino' | 'Unisex';

export type ConcentracionPerfume = 'Parfum' | 'EDP' | 'EDT' | 'EDC' | 'Colonia';

export type FamiliaOlfativa =
  | 'Floral'
  | 'Oriental'
  | 'Amaderado'
  | 'Fresco'
  | 'Citrico'
  | 'Acuático'
  | 'Gourmand'
  | 'Fougère';

// ─── Notas Olfativas e Intensidad ──────────────────────────────────────────

export interface NotasOlfativas {
  salida?: string[];
  corazon?: string[];
  fondo?: string[];
}

export type NivelIntensidad = 1 | 2 | 3 | 4 | 5;

// Acordes principales: vista rápida tipo "gráfico de barras" (nombre + qué tan
// presente está en la fragancia, 1-100), ordenados de más a menos presente.
export interface AcordePrincipal {
  nombre: string;
  intensidad: number; // 1-100
}

// ─── Modelos de datos ──────────────────────────────────────────────────────

export interface Marca {
  id: string;
  nombre: string;
  historia?: string | null;
}

export interface Perfume {
  id: string;
  nombre: string;
  marcaId: string;
  marca: Marca;
  clasificacion: ClasificacionPerfume;
  genero: GeneroPerfume;
  concentracion: ConcentracionPerfume;
  volumenMl: number;
  familiaOlfativa: FamiliaOlfativa;
  descripcion?: string | null;
  imagenUrl?: string | null;
  precioVentaCrc: number;     // Precio público (visible al cliente)
  stockProveedor: boolean;
  // Nota: precioProveedorCrc y margenGanancia NO se exponen al frontend
  imagenes?: string[];   // preparado para multi-ángulo (v2); v1 puede traer 0 o 1 elemento
  notas?: NotasOlfativas;
  duracion?: NivelIntensidad;
  proyeccion?: NivelIntensidad;
  acordes?: AcordePrincipal[];
}

export interface Pedido {
  id: string;
  fechaPedido: string; // ISO string
  clienteNombre: string;
  clienteWhatsapp: string;
  clienteDireccion: string;
  perfumeId: string;
  perfume: Perfume;
  totalCobradoCrc: number;
  estadoPagoSinpe: 'PENDIENTE' | 'CONFIRMADO';
  estadoDespacho: 'NO_ENVIADO' | 'ENVIADO' | 'ENTREGADO';
}

// ─── Tipos para el carrito ────────────────────────────────────────────────

export interface ItemCarrito {
  perfume: Perfume;
  cantidad: number;
}

// ─── Tipos para filtros del catálogo ──────────────────────────────────────

export interface FiltrosCatalogo {
  clasificacion?: ClasificacionPerfume;
  genero?: GeneroPerfume;
  familiaOlfativa?: FamiliaOlfativa;
  marcaId?: string;
  busqueda?: string;
}

// ─── Tipos de respuesta de la API ─────────────────────────────────────────

export interface RespuestaListado<T> {
  datos: T[];
  total: number;
  pagina: number;
  porPagina: number;
}
