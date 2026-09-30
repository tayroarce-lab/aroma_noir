'use client';

import { useMemo } from 'react';
import { usePedidosPanel } from '@/modulos/pedidos/hooks/usePedidosPanel';
import { resumir } from '@/modulos/pedidos/utilidades/estadisticas';
import MapaZonas from '@/modulos/pedidos/componentes/MapaZonas';
import TarjetaPedidoAdmin from '@/modulos/pedidos/componentes/TarjetaPedidoAdmin';
import { formatearCRC } from '@/lib/formateadores';

function Indicador({ titulo, valor, nota }: { titulo: string; valor: string | number; nota?: string }) {
  return (
    <div className="bg-hueso border border-arena rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-ceniza">{titulo}</p>
      <p className="font-serif text-3xl text-carbon mt-1">{valor}</p>
      {nota && <p className="text-xs text-ceniza mt-1">{nota}</p>}
    </div>
  );
}

export default function PaginaAdmin() {
  const { pedidos, cargando, error } = usePedidosPanel();
  const r = useMemo(() => resumir(pedidos), [pedidos]);

  return (
    <div className="admin-pagina animar-entrada">
      <div className="admin-header">
        <div>
          <h1 className="admin-titulo">Dashboard</h1>
          <p className="admin-subtitulo">Datos reales de los pedidos tomados por Lucía · se actualiza cada minuto</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}

      {cargando ? (
        <p className="text-sm text-ceniza">Cargando…</p>
      ) : (
        <div className="space-y-6">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Indicadores">
            <Indicador
              titulo="Ventas confirmadas"
              valor={formatearCRC(r.ingresos)}
              nota={`${r.ventas.length} ${r.ventas.length === 1 ? 'pedido pagado' : 'pedidos pagados'}`}
            />
            <Indicador titulo="Ticket promedio" valor={formatearCRC(r.ticketPromedio)} />
            <Indicador titulo="Pedidos abiertos" valor={r.abiertos} nota="Aún sin pago confirmado" />
            <Indicador titulo="Requieren acción" valor={r.requierenAccion} nota="Stock, comprobante o envío" />
          </section>

          <MapaZonas zonas={r.zonas} ventasSinZona={r.ventasSinZona} />

          <section className="bg-hueso border border-arena rounded-lg p-5" aria-label="Perfumes más vendidos">
            <h2 className="font-serif text-2xl text-carbon">Perfumes más vendidos</h2>
            {r.topPerfumes.length === 0 ? (
              <p className="text-sm text-grafito mt-2">Aún no hay ventas confirmadas.</p>
            ) : (
              <ol className="mt-3 space-y-1.5 text-sm text-grafito">
                {r.topPerfumes.slice(0, 8).map((p, i) => (
                  <li key={p.clave} className="flex justify-between gap-3">
                    <span>
                      {i + 1}. {p.marca} <strong className="text-carbon">{p.perfume}</strong>
                    </span>
                    <span className="whitespace-nowrap">
                      {p.unidades} {p.unidades === 1 ? 'unidad' : 'unidades'} · {formatearCRC(p.ingresos)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section aria-label="Pedidos recientes">
            <h2 className="font-serif text-2xl text-carbon mb-3">Pedidos recientes</h2>
            {pedidos.length === 0 ? (
              <p className="text-sm text-grafito">Todavía no hay pedidos.</p>
            ) : (
              <div className="space-y-3">
                {pedidos.slice(0, 5).map((p) => (
                  <TarjetaPedidoAdmin key={p.codigo} pedido={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
