'use client';

import type {
  FiltroEstadoPago,
  FiltroEstadoDespacho,
} from '../hooks/usePedidosAdmin';

interface PropsFiltrosPedidos {
  filtroPago: FiltroEstadoPago;
  filtroDespacho: FiltroEstadoDespacho;
  busqueda: string;
  pendientesAccion: number;
  onFiltroPago:     (v: FiltroEstadoPago) => void;
  onFiltroDespacho: (v: FiltroEstadoDespacho) => void;
  onBusqueda:       (v: string) => void;
  total: number;
}

const OPCIONES_PAGO: { valor: FiltroEstadoPago; etiqueta: string; emoji: string }[] = [
  { valor: 'TODOS',      etiqueta: 'Todos',      emoji: '◉' },
  { valor: 'PENDIENTE',  etiqueta: 'Pendiente',  emoji: '⏳' },
  { valor: 'CONFIRMADO', etiqueta: 'Confirmado', emoji: '✅' },
];

const OPCIONES_DESPACHO: { valor: FiltroEstadoDespacho; etiqueta: string; emoji: string }[] = [
  { valor: 'TODOS',       etiqueta: 'Todos',       emoji: '◉' },
  { valor: 'NO_ENVIADO',  etiqueta: 'Sin enviar',  emoji: '📦' },
  { valor: 'ENVIADO',     etiqueta: 'En camino',   emoji: '🚚' },
  { valor: 'ENTREGADO',   etiqueta: 'Entregado',   emoji: '✓' },
];

export default function FiltroPedidos({
  filtroPago,
  filtroDespacho,
  busqueda,
  pendientesAccion,
  onFiltroPago,
  onFiltroDespacho,
  onBusqueda,
  total,
}: PropsFiltrosPedidos) {
  return (
    <div className="pedidos-filtros">
      {/* Alerta de acción requerida */}
      {pendientesAccion > 0 && (
        <div className="pedidos-alerta">
          <span className="pedidos-alerta-icono">⚡</span>
          <span>
            <strong>{pendientesAccion} pedido{pendientesAccion > 1 ? 's' : ''}</strong>
            {' '}requiere{pendientesAccion > 1 ? 'n' : ''} acción
          </span>
        </div>
      )}

      {/* Buscador */}
      <div className="buscador-envoltorio">
        <svg className="buscador-icono" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar cliente, teléfono o perfume..."
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          className="buscador-input"
          id="busqueda-pedidos"
        />
        {busqueda && (
          <button onClick={() => onBusqueda('')} className="buscador-limpiar">✕</button>
        )}
      </div>

      {/* Filtros en línea */}
      <div className="pedidos-filtros-fila">
        {/* Pago */}
        <div className="pedidos-filtro-grupo">
          <span className="pedidos-filtro-label">Pago SINPE</span>
          <div className="pedidos-filtro-chips">
            {OPCIONES_PAGO.map(({ valor, etiqueta, emoji }) => (
              <button
                key={valor}
                onClick={() => onFiltroPago(valor)}
                className={`chip-filtro-pedido ${filtroPago === valor ? 'chip-filtro-activo' : ''}`}
              >
                {emoji} {etiqueta}
              </button>
            ))}
          </div>
        </div>

        {/* Despacho */}
        <div className="pedidos-filtro-grupo">
          <span className="pedidos-filtro-label">Despacho</span>
          <div className="pedidos-filtro-chips">
            {OPCIONES_DESPACHO.map(({ valor, etiqueta, emoji }) => (
              <button
                key={valor}
                onClick={() => onFiltroDespacho(valor)}
                className={`chip-filtro-pedido ${filtroDespacho === valor ? 'chip-filtro-activo' : ''}`}
              >
                {emoji} {etiqueta}
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        <div className="pedidos-filtro-contador">
          <span className="filtros-total">{total} {total === 1 ? 'pedido' : 'pedidos'}</span>
        </div>
      </div>
    </div>
  );
}
