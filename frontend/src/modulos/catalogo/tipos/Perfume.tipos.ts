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
