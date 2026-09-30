/**
 * Pedido tal como lo entrega n8n al panel (solo lectura).
 * No incluye cédula, teléfono ni dirección exacta; solo provincia y cantón.
 */
export interface ItemPedido {
  perfume: string;
  marca: string;
  concentracion: string | null;
  cantidad: number;
  precio: number;
}

export type EstadoPedido =
  | 'pendiente_verificar_stock'
  | 'esperando_pago'
  | 'comprobante_en_revision'
  | 'pagado'
  | 'enviado_a_proveedor'
  | 'entregado'
  | 'rechazado'
  | 'cancelado';

export interface PedidoPanel {
  codigo: string;
  estado: EstadoPedido;
  creado: string;
  canal: string;
  cliente: string;
  total: number;
  provincia: string | null;
  canton: string | null;
  pago: string | null;
  items: ItemPedido[];
}
