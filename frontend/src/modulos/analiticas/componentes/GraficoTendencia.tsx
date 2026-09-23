'use client';

import type { PuntoDeTendencia } from '../tipos/Analiticas.tipos';
import { formatearCRC } from '@/lib/formateadores';

interface PropsGraficoTendencia {
  datos: PuntoDeTendencia[];
  cargando?: boolean;
}

function abreviarFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO + 'T12:00:00');
  return fecha.toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric' });
}

export default function GraficoTendencia({ datos, cargando = false }: PropsGraficoTendencia) {
  if (cargando) {
    return (
      <div className="grafico-contenedor">
        <div className="esqueleto-linea esqueleto-corta" style={{ marginBottom: '1.5rem' }} />
        <div style={{ height: 180, background: 'var(--color-hueso)', borderRadius: 'var(--radius-sm)', animation: 'shimmer 1.5s infinite', backgroundSize: '800px 100%', backgroundImage: 'linear-gradient(90deg, var(--color-hueso) 25%, var(--color-arena) 50%, var(--color-hueso) 75%)' }} />
      </div>
    );
  }

  const maxIngresos = Math.max(...datos.map((d) => d.ingresos), 1);
  const maxPedidos = Math.max(...datos.map((d) => d.pedidos), 1);
  const alturaGrafico = 160;
  const anchoBarra = 100 / datos.length;

  return (
    <div className="grafico-contenedor">
      <div className="grafico-encabezado">
        <h3 className="grafico-titulo">Actividad — Últimos 7 días</h3>
        <div className="grafico-leyenda">
          <span className="leyenda-item leyenda-ingresos">Ingresos</span>
          <span className="leyenda-item leyenda-pedidos">Pedidos</span>
        </div>
      </div>

      {/* SVG Gráfico de barras */}
      <div className="grafico-svg-envoltorio">
        <svg
          viewBox={`0 0 100 ${alturaGrafico + 30}`}
          preserveAspectRatio="none"
          className="grafico-svg"
          role="img"
          aria-label="Gráfico de tendencia de ingresos y pedidos en los últimos 7 días"
        >
          {/* Líneas de referencia */}
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1="0" y1={alturaGrafico * (1 - pct)}
              x2="100" y2={alturaGrafico * (1 - pct)}
              stroke="var(--color-arena)"
              strokeWidth="0.3"
              strokeDasharray="1,1"
            />
          ))}

          {/* Barras de ingresos */}
          {datos.map((d, i) => {
            const altura = (d.ingresos / maxIngresos) * alturaGrafico;
            const x = i * anchoBarra + anchoBarra * 0.1;
            const ancho = anchoBarra * 0.45;
            return (
              <g key={`ing-${i}`}>
                <rect
                  x={x} y={alturaGrafico - altura}
                  width={ancho} height={altura}
                  fill="var(--color-dorado)"
                  opacity="0.85"
                  rx="0.5"
                  className="grafico-barra"
                >
                  <title>{`${abreviarFecha(d.fecha)}: ${formatearCRC(d.ingresos)}`}</title>
                </rect>
              </g>
            );
          })}

          {/* Barras de pedidos */}
          {datos.map((d, i) => {
            const altura = (d.pedidos / maxPedidos) * alturaGrafico * 0.6;
            const x = i * anchoBarra + anchoBarra * 0.1 + anchoBarra * 0.45 + 0.5;
            const ancho = anchoBarra * 0.4;
            return (
              <g key={`ped-${i}`}>
                <rect
                  x={x} y={alturaGrafico - altura}
                  width={ancho} height={altura}
                  fill="var(--color-arabe)"
                  opacity="0.7"
                  rx="0.5"
                  className="grafico-barra"
                >
                  <title>{`${abreviarFecha(d.fecha)}: ${d.pedidos} pedidos`}</title>
                </rect>
              </g>
            );
          })}

          {/* Etiquetas del eje X */}
          {datos.map((d, i) => (
            <text
              key={`lbl-${i}`}
              x={i * anchoBarra + anchoBarra * 0.5}
              y={alturaGrafico + 16}
              textAnchor="middle"
              fontSize="4"
              fill="var(--color-ceniza)"
              fontFamily="var(--font-sans)"
            >
              {abreviarFecha(d.fecha)}
            </text>
          ))}
        </svg>
      </div>

      {/* Totales del período */}
      <div className="grafico-totales">
        <div className="grafico-total-item">
          <span className="grafico-total-label">Total período</span>
          <span className="grafico-total-valor">
            {formatearCRC(datos.reduce((a, d) => a + d.ingresos, 0))}
          </span>
        </div>
        <div className="grafico-total-item">
          <span className="grafico-total-label">Pedidos</span>
          <span className="grafico-total-valor">
            {datos.reduce((a, d) => a + d.pedidos, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
