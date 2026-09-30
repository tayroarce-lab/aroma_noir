'use client';

import type { PedidoPanel } from '../tipos/Pedido.tipos';
import { ETIQUETA_ESTADO, ESTADOS_ACCION, ESTADOS_VENTA } from '../utilidades/estadisticas';
import { formatearCRC } from '@/lib/formateadores';

function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Costa_Rica',
  }).format(new Date(iso));
}

function claseEstado(estado: PedidoPanel['estado']): string {
  if (ESTADOS_VENTA.includes(estado)) return 'bg-green-100 text-green-800';
  if (estado === 'rechazado' || estado === 'cancelado') return 'bg-red-100 text-red-800';
  if (ESTADOS_ACCION.includes(estado)) return 'bg-amber-100 text-amber-800';
  return 'bg-arena text-grafito';
}

export default function TarjetaPedidoAdmin({ pedido }: { pedido: PedidoPanel }) {
  const zona = [pedido.canton, pedido.provincia].filter(Boolean).join(', ');
  return (
    <article className="bg-hueso border border-arena rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-carbon">
            {pedido.codigo} <span className="text-ceniza font-normal">· {pedido.cliente || 'Cliente'}</span>
          </p>
          <p className="text-xs text-ceniza">
            {fechaCorta(pedido.creado)} · {pedido.canal}
            {zona ? ` · ${zona}` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium text-carbon">{formatearCRC(pedido.total)}</p>
          <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs ${claseEstado(pedido.estado)}`}>
            {ETIQUETA_ESTADO[pedido.estado] ?? pedido.estado}
          </span>
        </div>
      </div>
      <ul className="mt-3 space-y-0.5 text-sm text-grafito">
        {pedido.items.map((it) => (
          <li key={`${it.marca}-${it.perfume}-${it.concentracion}`}>
            {it.cantidad} × {it.marca} {it.perfume}
            {it.concentracion ? ` ${it.concentracion}` : ''} · {formatearCRC(it.precio)}
          </li>
        ))}
      </ul>
    </article>
  );
}
