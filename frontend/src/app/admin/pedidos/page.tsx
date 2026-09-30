'use client';

import { useMemo, useState } from 'react';
import { usePedidosPanel } from '@/modulos/pedidos/hooks/usePedidosPanel';
import TarjetaPedidoAdmin from '@/modulos/pedidos/componentes/TarjetaPedidoAdmin';
import { ESTADOS_ACCION, ESTADOS_ABIERTOS, ESTADOS_VENTA } from '@/modulos/pedidos/utilidades/estadisticas';

type Filtro = 'todos' | 'accion' | 'abiertos' | 'ventas';

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'accion', etiqueta: 'Requieren acción' },
  { valor: 'abiertos', etiqueta: 'Abiertos' },
  { valor: 'ventas', etiqueta: 'Ventas confirmadas' },
];

export default function PaginaPedidosAdmin() {
  const { pedidos, cargando, error } = usePedidosPanel();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return pedidos.filter((p) => {
      if (filtro === 'accion' && !ESTADOS_ACCION.includes(p.estado)) return false;
      if (filtro === 'abiertos' && !ESTADOS_ABIERTOS.includes(p.estado)) return false;
      if (filtro === 'ventas' && !ESTADOS_VENTA.includes(p.estado)) return false;
      if (!t) return true;
      return (
        p.codigo.toLowerCase().includes(t) ||
        p.cliente.toLowerCase().includes(t) ||
        p.items.some((i) => `${i.marca} ${i.perfume}`.toLowerCase().includes(t))
      );
    });
  }, [pedidos, filtro, busqueda]);

  return (
    <div className="admin-pagina animar-entrada">
      <div className="admin-header">
        <div>
          <h1 className="admin-titulo">Pedidos</h1>
          <p className="admin-subtitulo">
            Pedidos reales de Lucía · solo lectura. El stock y los pagos se aprueban desde el grupo de WhatsApp.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={`rounded-full border px-3 py-1 text-sm ${
              filtro === f.valor
                ? 'bg-carbon text-perla border-carbon'
                : 'bg-hueso text-grafito border-arena hover:border-dorado'
            }`}
          >
            {f.etiqueta}
          </button>
        ))}
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar código, cliente o perfume…"
          className="ml-auto w-full sm:w-72 rounded-md border border-arena bg-perla px-3 py-1.5 text-sm outline-none focus:border-dorado"
        />
      </div>

      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}

      {cargando ? (
        <p className="text-sm text-ceniza">Cargando pedidos…</p>
      ) : visibles.length === 0 ? (
        <p className="text-sm text-grafito">
          {pedidos.length === 0
            ? 'Todavía no hay pedidos. Aparecerán aquí cuando Lucía cree el primero.'
            : 'Ningún pedido coincide con el filtro.'}
        </p>
      ) : (
        <div className="space-y-3">
          {visibles.map((p) => (
            <TarjetaPedidoAdmin key={p.codigo} pedido={p} />
          ))}
        </div>
      )}
    </div>
  );
}
