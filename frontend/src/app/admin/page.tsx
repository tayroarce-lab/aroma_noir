'use client';

import { useAnaliticas } from '@/modulos/analiticas/hooks/useAnaliticas';
import TarjetaKPI from '@/modulos/analiticas/componentes/TarjetaKPI';
import GraficoTendencia from '@/modulos/analiticas/componentes/GraficoTendencia';
import GraficoClasificaciones from '@/modulos/analiticas/componentes/GraficoClasificaciones';
import TablaPedidos from '@/modulos/analiticas/componentes/TablaPedidos';
import { formatearCRC } from '@/lib/formateadores';

export default function PaginaAdmin() {
  const { datos, cargando } = useAnaliticas();

  const r = datos?.resumen;

  return (
    <div className="admin-pagina animar-entrada">
      {/* Encabezado del dashboard */}
      <div className="admin-header">
        <div>
          <h1 className="admin-titulo">Dashboard</h1>
          <p className="admin-subtitulo">
            Resumen ejecutivo de Aroma Noir CR
          </p>
        </div>
        <div className="admin-header-acciones">
          <span className="admin-estado-dot" />
          <span className="admin-estado-texto">Datos en tiempo real</span>
        </div>
      </div>

      {/* ─── KPIs ─────────────────────────────────────────────── */}
      <section className="admin-kpi-grid" aria-label="Indicadores clave">
        <TarjetaKPI
          titulo="Ingresos Confirmados"
          valor={r?.ingresoTotalCrc ?? 0}
          formatoCRC
          variacion={12.4}
          color="dorado"
          cargando={cargando}
          icono={
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          }
        />

        <TarjetaKPI
          titulo="Total de Pedidos"
          valor={r?.totalPedidos ?? 0}
          variacion={8.1}
          color="azul"
          cargando={cargando}
          icono={
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          }
        />

        <TarjetaKPI
          titulo="Tasa de Conversión"
          valor={`${r?.tasaConversion ?? 0}%`}
          variacion={2.3}
          color="verde"
          cargando={cargando}
          icono={
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          }
        />

        <TarjetaKPI
          titulo="Pedidos Pendientes"
          valor={r?.pedidosPendientes ?? 0}
          variacion={-15}
          color="rojo"
          cargando={cargando}
          icono={
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          }
        />
      </section>

      {/* ─── Estado del despacho ──────────────────────────────── */}
      {!cargando && r && (
        <section className="admin-despacho-banner animar-entrada" aria-label="Estado del despacho">
          <div className="despacho-item">
            <span className="despacho-icono">📦</span>
            <div>
              <p className="despacho-valor">{r.pedidosEnviados}</p>
              <p className="despacho-label">En camino</p>
            </div>
          </div>
          <div className="despacho-divisor" />
          <div className="despacho-item">
            <span className="despacho-icono">✅</span>
            <div>
              <p className="despacho-valor">{r.pedidosEntregados}</p>
              <p className="despacho-label">Entregados</p>
            </div>
          </div>
          <div className="despacho-divisor" />
          <div className="despacho-item">
            <span className="despacho-icono">🏪</span>
            <div>
              <p className="despacho-valor">{r.totalProductos}</p>
              <p className="despacho-label">Productos activos</p>
            </div>
          </div>
          <div className="despacho-divisor" />
          <div className="despacho-item">
            <span className="despacho-icono">💰</span>
            <div>
              <p className="despacho-valor">{formatearCRC(r.ingresoTotalCrc / Math.max(r.pedidosConfirmados, 1))}</p>
              <p className="despacho-label">Ticket promedio</p>
            </div>
          </div>
        </section>
      )}

      {/* ─── Gráficos ─────────────────────────────────────────── */}
      <section className="admin-graficos-grid" aria-label="Gráficos de analíticas">
        <GraficoTendencia
          datos={datos?.tendencia ?? []}
          cargando={cargando}
        />
        <GraficoClasificaciones
          datos={datos?.clasificaciones ?? { Nicho: { ingresos: 0, pedidos: 0 }, Arabe: { ingresos: 0, pedidos: 0 }, 'Diseñador': { ingresos: 0, pedidos: 0 } }}
          cargando={cargando}
        />
      </section>

      {/* ─── Top perfumes ─────────────────────────────────────── */}
      {!cargando && datos?.topPerfumes && (
        <section className="admin-top-perfumes animar-entrada" aria-label="Top perfumes más vendidos">
          <h3 className="grafico-titulo" style={{ marginBottom: '1.25rem' }}>Top Fragancias por Ingreso</h3>
          <div className="top-perfumes-lista">
            {datos.topPerfumes.map((item, i) => {
              const maxIngreso = datos.topPerfumes[0].ingresosCrc;
              const pct = (item.ingresosCrc / maxIngreso) * 100;
              return (
                <div key={item.perfume.id} className="top-perfume-fila">
                  <span className="top-perfume-posicion">#{i + 1}</span>
                  <div className="top-perfume-info">
                    <p className="top-perfume-nombre">
                      {item.perfume.marca.nombre} <strong>{item.perfume.nombre}</strong>
                    </p>
                    <div className="top-perfume-barra-envoltorio">
                      <div className="top-perfume-barra" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="top-perfume-datos">
                    <span className="top-perfume-ingresos">{formatearCRC(item.ingresosCrc)}</span>
                    <span className="top-perfume-pedidos">{item.pedidos} pedidos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Tabla de pedidos ─────────────────────────────────── */}
      <section aria-label="Pedidos recientes">
        <TablaPedidos
          pedidos={datos?.pedidosRecientes ?? []}
          cargando={cargando}
        />
      </section>
    </div>
  );
}
