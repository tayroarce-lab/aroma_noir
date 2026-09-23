'use client';

import type { VentasPorClasificacion } from '../tipos/Analiticas.tipos';
import { formatearCRC } from '@/lib/formateadores';

interface PropsGraficoClasificaciones {
  datos: VentasPorClasificacion;
  cargando?: boolean;
}

const COLORES_CLASIFICACION: Record<string, string> = {
  Nicho:      'var(--color-nicho)',
  Arabe:      'var(--color-arabe)',
  'Diseñador': 'var(--color-disenador)',
};

const ETIQUETAS: Record<string, string> = {
  Nicho:      '◆ Nicho',
  Arabe:      '☽ Árabe',
  'Diseñador': '✦ Diseñador',
};

export default function GraficoClasificaciones({ datos, cargando = false }: PropsGraficoClasificaciones) {
  if (cargando) {
    return (
      <div className="grafico-contenedor">
        <div className="esqueleto-linea esqueleto-corta" style={{ marginBottom: '1.5rem' }} />
        <div className="grafico-donut-esqueleto" />
      </div>
    );
  }

  const entradas = Object.entries(datos) as [keyof typeof datos, typeof datos['Nicho']][];
  const totalIngresos = entradas.reduce((a, [, v]) => a + v.ingresos, 0);
  const totalPedidos = entradas.reduce((a, [, v]) => a + v.pedidos, 0);

  // Calcular ángulos del donut SVG
  let anguloAcumulado = -90; // Empieza desde arriba
  const RADIO = 35;
  const RADIO_INTERNO = 22;
  const CENTRO = 50;

  function polarACartesiano(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcoSVG(pct: number, color: string, clasificacion: string): React.ReactNode {
    const angulo = pct * 360;
    const inicio = anguloAcumulado;
    anguloAcumulado += angulo;
    const fin = anguloAcumulado - 0.5; // pequeño gap visual

    const p1 = polarACartesiano(CENTRO, CENTRO, RADIO, inicio);
    const p2 = polarACartesiano(CENTRO, CENTRO, RADIO, fin);
    const p3 = polarACartesiano(CENTRO, CENTRO, RADIO_INTERNO, fin);
    const p4 = polarACartesiano(CENTRO, CENTRO, RADIO_INTERNO, inicio);
    const grande = angulo > 180 ? 1 : 0;

    const d = [
      `M ${p1.x} ${p1.y}`,
      `A ${RADIO} ${RADIO} 0 ${grande} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${RADIO_INTERNO} ${RADIO_INTERNO} 0 ${grande} 0 ${p4.x} ${p4.y}`,
      'Z',
    ].join(' ');

    return (
      <path key={clasificacion} d={d} fill={color} className="donut-segmento">
        <title>{clasificacion}: {formatearCRC(datos[clasificacion as keyof typeof datos]?.ingresos ?? 0)}</title>
      </path>
    );
  }

  return (
    <div className="grafico-contenedor">
      <h3 className="grafico-titulo">Ingresos por Colección</h3>

      <div className="donut-layout">
        {/* Donut chart */}
        <div className="donut-envoltorio">
          <svg viewBox="0 0 100 100" className="donut-svg" role="img" aria-label="Gráfico de ingresos por clasificación">
            {entradas.map(([clave, val]) => {
              const pct = totalIngresos > 0 ? val.ingresos / totalIngresos : 0;
              return arcoSVG(pct, COLORES_CLASIFICACION[clave] ?? '#999', clave);
            })}
            {/* Centro del donut */}
            <text x="50" y="48" textAnchor="middle" fontSize="6" fill="var(--color-carbon)" fontFamily="var(--font-serif)" fontWeight="500">
              {totalPedidos}
            </text>
            <text x="50" y="56" textAnchor="middle" fontSize="4" fill="var(--color-ceniza)" fontFamily="var(--font-sans)">
              pedidos
            </text>
          </svg>
        </div>

        {/* Leyenda */}
        <div className="donut-leyenda">
          {entradas.map(([clave, val]) => {
            const pct = totalIngresos > 0 ? ((val.ingresos / totalIngresos) * 100).toFixed(1) : '0.0';
            return (
              <div key={clave} className="donut-leyenda-item">
                <span className="donut-leyenda-punto" style={{ background: COLORES_CLASIFICACION[clave] }} />
                <div className="donut-leyenda-info">
                  <span className="donut-leyenda-label">{ETIQUETAS[clave]}</span>
                  <span className="donut-leyenda-valor">{formatearCRC(val.ingresos)}</span>
                  <span className="donut-leyenda-pct">{pct}% · {val.pedidos} pedidos</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
