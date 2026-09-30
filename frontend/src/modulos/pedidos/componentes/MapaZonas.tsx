'use client';

import { useState } from 'react';
import { formatearCRC } from '@/lib/formateadores';
import type { EstadisticaZona, Provincia } from '../utilidades/estadisticas';

/** Posición de cada provincia en una cuadrícula esquemática (col, fila, ancho, alto). */
const POSICION: Record<Provincia, [number, number, number, number]> = {
  Guanacaste: [0, 0, 1, 1],
  Alajuela: [1, 0, 1, 1],
  Heredia: [2, 0, 1, 1],
  Limón: [3, 0, 1, 2],
  Puntarenas: [0, 1, 1, 1],
  'San José': [1, 1, 1, 1],
  Cartago: [2, 1, 1, 1],
};

const CELDA = 96;
const HUECO = 8;

interface Props {
  zonas: EstadisticaZona[];
  ventasSinZona: number;
}

export default function MapaZonas({ zonas, ventasSinZona }: Props) {
  const [elegida, setElegida] = useState<Provincia | null>(null);
  const porProvincia = new Map(zonas.map((z) => [z.provincia, z]));
  const maximo = Math.max(1, ...zonas.map((z) => z.pedidos));
  const zonaActiva = elegida ? porProvincia.get(elegida) : zonas[0];

  return (
    <section className="bg-hueso border border-arena rounded-lg p-5" aria-label="Mapa de zonas de compra">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-2xl text-carbon">Dónde compran</h2>
        <p className="text-xs text-ceniza">Mapa esquemático por provincia · ventas confirmadas</p>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[auto_1fr]">
        <svg
          viewBox={`0 0 ${4 * CELDA + 3 * HUECO} ${2 * CELDA + HUECO}`}
          className="w-full max-w-md"
          role="img"
          aria-label="Provincias de Costa Rica coloreadas según cantidad de ventas"
        >
          {(Object.keys(POSICION) as Provincia[]).map((prov) => {
            const [c, f, an, al] = POSICION[prov];
            const x = c * (CELDA + HUECO);
            const y = f * (CELDA + HUECO);
            const ancho = an * CELDA + (an - 1) * HUECO;
            const alto = al * CELDA + (al - 1) * HUECO;
            const z = porProvincia.get(prov);
            const intensidad = z ? 0.25 + 0.75 * (z.pedidos / maximo) : 0;
            const activa = zonaActiva?.provincia === prov;
            return (
              <g
                key={prov}
                onClick={() => setElegida(prov)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${prov}: ${z?.pedidos ?? 0} ventas`}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setElegida(prov)}
              >
                <rect
                  x={x}
                  y={y}
                  width={ancho}
                  height={alto}
                  rx={10}
                  fill={z ? '#B8975A' : '#E8E4DC'}
                  fillOpacity={z ? intensidad : 0.6}
                  stroke={activa ? '#2C2C2C' : '#C9B99A'}
                  strokeWidth={activa ? 2.5 : 1}
                />
                <text x={x + ancho / 2} y={y + alto / 2 - 4} textAnchor="middle" fontSize={13} fill="#2C2C2C">
                  {prov}
                </text>
                <text x={x + ancho / 2} y={y + alto / 2 + 14} textAnchor="middle" fontSize={12} fill="#555555">
                  {z ? `${z.pedidos} ${z.pedidos === 1 ? 'venta' : 'ventas'}` : '—'}
                </text>
              </g>
            );
          })}
        </svg>

        <div>
          {!zonaActiva ? (
            <p className="text-sm text-grafito">
              Aún no hay ventas confirmadas con zona registrada. Cuando un cliente pague y entregue sus datos de
              envío, su provincia aparecerá aquí.
            </p>
          ) : (
            <>
              <p className="text-sm text-ceniza">Zona seleccionada</p>
              <p className="font-serif text-2xl text-carbon">{zonaActiva.provincia}</p>
              <p className="text-sm text-grafito">
                {zonaActiva.pedidos} {zonaActiva.pedidos === 1 ? 'venta' : 'ventas'} ·{' '}
                {formatearCRC(zonaActiva.ingresos)}
              </p>

              <h3 className="mt-4 text-sm font-medium text-carbon">Perfumes que más se compran aquí</h3>
              <ol className="mt-1 space-y-1 text-sm text-grafito">
                {zonaActiva.perfumes.slice(0, 5).map((p, i) => (
                  <li key={p.clave} className="flex justify-between gap-3">
                    <span>
                      {i + 1}. {p.marca} <strong className="text-carbon">{p.perfume}</strong>
                    </span>
                    <span className="whitespace-nowrap">
                      {p.unidades} {p.unidades === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </li>
                ))}
              </ol>

              <h3 className="mt-4 text-sm font-medium text-carbon">Cantones</h3>
              <p className="text-sm text-grafito">
                {zonaActiva.cantones.map((c) => `${c.canton} (${c.pedidos})`).join(' · ')}
              </p>
            </>
          )}
          {ventasSinZona > 0 && (
            <p className="mt-4 text-xs text-ceniza">
              {ventasSinZona} {ventasSinZona === 1 ? 'venta' : 'ventas'} sin provincia registrada no aparecen en el mapa.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
