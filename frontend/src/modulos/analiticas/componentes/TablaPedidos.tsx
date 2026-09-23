'use client';

import type { PedidoReciente } from '../tipos/Analiticas.tipos';
import { formatearCRC } from '@/lib/formateadores';

interface PropsTablaPedidos {
  pedidos: PedidoReciente[];
  cargando?: boolean;
}

const ETIQUETA_PAGO: Record<string, { texto: string; clase: string }> = {
  PENDIENTE:  { texto: 'Pendiente',  clase: 'badge-estado-pendiente' },
  CONFIRMADO: { texto: 'Confirmado', clase: 'badge-estado-confirmado' },
};

const ETIQUETA_DESPACHO: Record<string, { texto: string; clase: string }> = {
  NO_ENVIADO: { texto: 'Sin enviar', clase: 'badge-despacho-no-enviado' },
  ENVIADO:    { texto: 'En camino',  clase: 'badge-despacho-enviado' },
  ENTREGADO:  { texto: 'Entregado',  clase: 'badge-despacho-entregado' },
};

function formatearHora(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Costa_Rica',
  }).format(new Date(iso));
}

export default function TablaPedidos({ pedidos, cargando = false }: PropsTablaPedidos) {
  if (cargando) {
    return (
      <div className="tabla-contenedor">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="tabla-fila-esqueleto">
            <div className="esqueleto-linea esqueleto-media" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="tabla-envoltorio">
      <div className="tabla-encabezado-seccion">
        <h3 className="grafico-titulo">Pedidos Recientes</h3>
        <span className="tabla-contador">{pedidos.length} registros</span>
      </div>
      <div className="tabla-contenedor">
        {/* Encabezado */}
        <div className="tabla-fila tabla-fila-header">
          <span>Fecha</span>
          <span>Cliente</span>
          <span>Fragancia</span>
          <span>Total</span>
          <span>Pago</span>
          <span>Envío</span>
        </div>

        {/* Filas */}
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="tabla-fila tabla-fila-dato animar-entrada">
            <span className="tabla-celda-fecha">{formatearHora(pedido.fechaPedido)}</span>
            <span className="tabla-celda-cliente">
              <strong>{pedido.clienteNombre}</strong>
              <small>{pedido.clienteWhatsapp}</small>
            </span>
            <span className="tabla-celda-perfume">
              <strong>{pedido.perfume.nombre}</strong>
              <small>{pedido.perfume.marca.nombre}</small>
            </span>
            <span className="tabla-celda-precio">{formatearCRC(pedido.totalCobradoCrc)}</span>
            <span>
              <span className={`badge-estado ${ETIQUETA_PAGO[pedido.estadoPagoSinpe].clase}`}>
                {ETIQUETA_PAGO[pedido.estadoPagoSinpe].texto}
              </span>
            </span>
            <span>
              <span className={`badge-estado ${ETIQUETA_DESPACHO[pedido.estadoDespacho].clase}`}>
                {ETIQUETA_DESPACHO[pedido.estadoDespacho].texto}
              </span>
            </span>
          </div>
        ))}

        {pedidos.length === 0 && (
          <div className="tabla-vacia">
            <p>No hay pedidos registrados aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
