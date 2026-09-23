'use client';

import { useState } from 'react';
import type { PedidoAdmin } from '../hooks/usePedidosAdmin';
import { formatearCRC } from '@/lib/formateadores';

interface PropsTarjetaPedidoAdmin {
  pedido: PedidoAdmin;
  onConfirmarPago:      (id: string) => void;
  onActualizarDespacho: (id: string, estado: 'ENVIADO' | 'ENTREGADO') => void;
  indice?: number;
}

const CLASIFICACION_CLASE: Record<string, string> = {
  Nicho: 'badge-nicho', Arabe: 'badge-arabe', 'Diseñador': 'badge-disenador',
};

const CLASIFICACION_ICONO: Record<string, string> = {
  Nicho: '◆', Arabe: '☽', 'Diseñador': '✦',
};

function formatearFechaRelativa(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const horas = Math.floor(mins / 60);
  const dias  = Math.floor(horas / 24);
  if (mins < 60)  return `hace ${mins}m`;
  if (horas < 24) return `hace ${horas}h`;
  return `hace ${dias}d`;
}

function formatearFechaCompleta(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Costa_Rica',
  }).format(new Date(iso));
}

export default function TarjetaPedidoAdmin({
  pedido,
  onConfirmarPago,
  onActualizarDespacho,
  indice = 0,
}: PropsTarjetaPedidoAdmin) {
  const [expandido, setExpandido] = useState(false);

  const esPendientePago    = pedido.estadoPagoSinpe === 'PENDIENTE';
  const puedeEnviar        = pedido.estadoPagoSinpe === 'CONFIRMADO' && pedido.estadoDespacho === 'NO_ENVIADO';
  const puedeMarcarEntrega = pedido.estadoDespacho === 'ENVIADO';
  const requiereAccion     = esPendientePago || puedeEnviar;

  const PASOS_DESPACHO = [
    { clave: 'NO_ENVIADO', etiqueta: 'Pendiente' },
    { clave: 'ENVIADO',    etiqueta: 'En camino'  },
    { clave: 'ENTREGADO',  etiqueta: 'Entregado'  },
  ];

  const pasoActual = PASOS_DESPACHO.findIndex(
    (p) => p.clave === pedido.estadoDespacho,
  );

  return (
    <div
      className={`tarjeta-pedido animar-entrada ${requiereAccion ? 'tarjeta-pedido-urgente' : ''}`}
      style={{ animationDelay: `${indice * 50}ms` }}
    >
      {/* ── Fila principal ─────────────────────────────── */}
      <div className="tp-fila-principal">
        {/* Indicador de urgencia */}
        {requiereAccion && <div className="tp-urgencia-dot" title="Requiere acción" />}

        {/* Fragancia */}
        <div className="tp-perfume">
          <span className={`badge-clasificacion ${CLASIFICACION_CLASE[pedido.perfume.clasificacion]} tp-badge`}>
            {CLASIFICACION_ICONO[pedido.perfume.clasificacion]} {pedido.perfume.clasificacion}
          </span>
          <p className="tp-perfume-nombre">
            <strong>{pedido.perfume.nombre}</strong>
          </p>
          <p className="tp-perfume-marca">{pedido.perfume.marca.nombre}</p>
        </div>

        {/* Cliente */}
        <div className="tp-cliente">
          <p className="tp-cliente-nombre">{pedido.clienteNombre}</p>
          <a
            href={`https://wa.me/506${pedido.clienteWhatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tp-cliente-wa"
          >
            💬 {pedido.clienteWhatsapp}
          </a>
        </div>

        {/* Total */}
        <div className="tp-total">
          <p className="tp-precio">{formatearCRC(pedido.totalCobradoCrc)}</p>
          <p className="tp-fecha" title={formatearFechaCompleta(pedido.fechaPedido)}>
            {formatearFechaRelativa(pedido.fechaPedido)}
          </p>
        </div>

        {/* Estado de pago */}
        <div className="tp-estado-pago">
          {esPendientePago ? (
            <span className="badge-estado badge-estado-pendiente">⏳ Pendiente</span>
          ) : (
            <span className="badge-estado badge-estado-confirmado">✓ Confirmado</span>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="tp-acciones">
          {esPendientePago && (
            <button
              onClick={() => onConfirmarPago(pedido.id)}
              className="tp-btn tp-btn-confirmar"
              title="Confirmar pago SINPE"
            >
              ✓ Confirmar pago
            </button>
          )}
          {puedeEnviar && (
            <button
              onClick={() => onActualizarDespacho(pedido.id, 'ENVIADO')}
              className="tp-btn tp-btn-enviar"
              title="Marcar como enviado"
            >
              🚚 Marcar enviado
            </button>
          )}
          {puedeMarcarEntrega && (
            <button
              onClick={() => onActualizarDespacho(pedido.id, 'ENTREGADO')}
              className="tp-btn tp-btn-entregado"
              title="Marcar como entregado"
            >
              ✓ Entregado
            </button>
          )}
          {!requiereAccion && !puedeMarcarEntrega && (
            <span className="tp-completado">✦ Completado</span>
          )}

          <button
            onClick={() => setExpandido(!expandido)}
            className="tp-btn-expandir"
            aria-expanded={expandido}
            aria-label="Ver detalles"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, transform: expandido ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Progreso de despacho (siempre visible si hay pago confirmado) ── */}
      {pedido.estadoPagoSinpe === 'CONFIRMADO' && (
        <div className="tp-progreso">
          {PASOS_DESPACHO.map((paso, i) => (
            <div key={paso.clave} className="tp-progreso-item">
              <div className={`tp-progreso-punto ${i <= pasoActual ? 'tp-progreso-punto-activo' : ''}`}>
                {i < pasoActual ? '✓' : i + 1}
              </div>
              <span className={`tp-progreso-label ${i <= pasoActual ? 'tp-progreso-label-activo' : ''}`}>
                {paso.etiqueta}
              </span>
              {i < PASOS_DESPACHO.length - 1 && (
                <div className={`tp-progreso-linea ${i < pasoActual ? 'tp-progreso-linea-activa' : ''}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Detalle expandido ────────────────────────────── */}
      {expandido && (
        <div className="tp-detalle animar-entrada">
          <div className="tp-detalle-grid">
            <div>
              <p className="tp-detalle-etiqueta">Dirección de entrega</p>
              <p className="tp-detalle-valor">{pedido.clienteDireccion ?? 'No registrada'}</p>
            </div>
            <div>
              <p className="tp-detalle-etiqueta">ID del pedido</p>
              <p className="tp-detalle-valor tp-detalle-codigo">{pedido.id}</p>
            </div>
            <div>
              <p className="tp-detalle-etiqueta">Fecha y hora</p>
              <p className="tp-detalle-valor">{formatearFechaCompleta(pedido.fechaPedido)}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/506${pedido.clienteWhatsapp.replace(/\D/g, '')}?text=Hola+${encodeURIComponent(pedido.clienteNombre)}+👋+Te+contactamos+de+LuxeParfums+CR.`}
            target="_blank"
            rel="noopener noreferrer"
            className="tp-btn-contactar-wa"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contactar al cliente por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
