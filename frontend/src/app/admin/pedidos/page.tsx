'use client';

import { usePedidosAdmin } from '@/modulos/pedidos/hooks/usePedidosAdmin';
import FiltroPedidos from '@/modulos/pedidos/componentes/FiltroPedidos';
import TarjetaPedidoAdmin from '@/modulos/pedidos/componentes/TarjetaPedidoAdmin';
import { formatearCRC } from '@/lib/formateadores';

export default function PaginaPedidosAdmin() {
  const {
    pedidos,
    total,
    pendientesAccion,
    filtroPago,     setFiltroPago,
    filtroDespacho, setFiltroDespacho,
    busqueda,       setBusqueda,
    actualizarEstadoPago,
    actualizarEstadoDespacho,
  } = usePedidosAdmin();

  const totalIngresos = pedidos.reduce((a, p) => a + p.totalCobradoCrc, 0);

  return (
    <div className="admin-pagina animar-entrada">
      {/* ── Encabezado ─────────────────────────────────── */}
      <div className="admin-header">
        <div>
          <h1 className="admin-titulo">Pedidos</h1>
          <p className="admin-subtitulo">
            Gestión de órdenes · Pago SINPE y estados de despacho
          </p>
        </div>
        {pendientesAccion > 0 && (
          <div className="pedidos-header-alerta">
            <span className="pedidos-header-alerta-num">{pendientesAccion}</span>
            <span className="pedidos-header-alerta-txt">
              {pendientesAccion === 1 ? 'pedido requiere' : 'pedidos requieren'} acción
            </span>
          </div>
        )}
      </div>

      {/* ── Mini KPIs de la vista ──────────────────────── */}
      <div className="pedidos-mini-kpis">
        <div className="pedidos-mini-kpi">
          <span className="pedidos-mini-kpi-valor">{total}</span>
          <span className="pedidos-mini-kpi-label">Resultados</span>
        </div>
        <div className="pedidos-mini-kpi">
          <span className="pedidos-mini-kpi-valor">{formatearCRC(totalIngresos)}</span>
          <span className="pedidos-mini-kpi-label">Total filtrado</span>
        </div>
        <div className="pedidos-mini-kpi pedidos-mini-kpi-urgente">
          <span className="pedidos-mini-kpi-valor">{pendientesAccion}</span>
          <span className="pedidos-mini-kpi-label">Requieren acción</span>
        </div>
      </div>

      {/* ── Filtros ────────────────────────────────────── */}
      <FiltroPedidos
        filtroPago={filtroPago}
        filtroDespacho={filtroDespacho}
        busqueda={busqueda}
        pendientesAccion={pendientesAccion}
        onFiltroPago={setFiltroPago}
        onFiltroDespacho={setFiltroDespacho}
        onBusqueda={setBusqueda}
        total={total}
      />

      {/* ── Lista de pedidos ───────────────────────────── */}
      {pedidos.length === 0 ? (
        <div className="pedidos-vacio">
          <p className="pedidos-vacio-icono">🔍</p>
          <p className="pedidos-vacio-texto">No se encontraron pedidos</p>
          <p className="pedidos-vacio-subtexto">
            Intenta con otros filtros o limpia la búsqueda.
          </p>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido, i) => (
            <TarjetaPedidoAdmin
              key={pedido.id}
              pedido={pedido}
              indice={i}
              onConfirmarPago={(id) => actualizarEstadoPago(id, 'CONFIRMADO')}
              onActualizarDespacho={actualizarEstadoDespacho}
            />
          ))}
        </div>
      )}
    </div>
  );
}
