/**
 * Tipos del dominio de analíticas.
 * Espejo del contrato de la API del backend.
 */

export interface ResumenAnaliticas {
  totalPedidos: number;
  totalProductos: number;
  ingresoTotalCrc: number;
  pedidosPendientes: number;
  pedidosConfirmados: number;
  pedidosEnviados: number;
  pedidosEntregados: number;
  tasaConversion: number;
}

export interface VentaClasificacion {
  ingresos: number;
  pedidos: number;
}

export interface VentasPorClasificacion {
  Nicho: VentaClasificacion;
  Arabe: VentaClasificacion;
  'Diseñador': VentaClasificacion;
}

export interface TopPerfume {
  perfume: {
    id: string;
    nombre: string;
    marca: { nombre: string };
    clasificacion: string;
  };
  ingresosCrc: number;
  pedidos: number;
}

export interface PedidoReciente {
  id: string;
  fechaPedido: string;
  clienteNombre: string;
  clienteWhatsapp: string;
  totalCobradoCrc: number;
  estadoPagoSinpe: 'PENDIENTE' | 'CONFIRMADO';
  estadoDespacho: 'NO_ENVIADO' | 'ENVIADO' | 'ENTREGADO';
  perfume: {
    nombre: string;
    marca: { nombre: string };
    clasificacion: string;
  };
}

export interface PuntoDeTendencia {
  fecha: string;   // YYYY-MM-DD
  pedidos: number;
  ingresos: number;
}

export interface EstadoInventario {
  conStock: number;
  sinStock: number;
  total: number;
}

export interface DatosDashboard {
  resumen: ResumenAnaliticas;
  clasificaciones: VentasPorClasificacion;
  topPerfumes: TopPerfume[];
  pedidosRecientes: PedidoReciente[];
  tendencia: PuntoDeTendencia[];
  inventario: EstadoInventario;
}
