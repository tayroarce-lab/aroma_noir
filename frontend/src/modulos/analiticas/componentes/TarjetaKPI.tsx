'use client';

import { formatearCRC } from '@/lib/formateadores';

interface PropsTarjetaKPI {
  titulo: string;
  valor: string | number;
  formatoCRC?: boolean;
  variacion?: number;       // % cambio vs período anterior (positivo = bueno)
  icono: React.ReactNode;
  color?: 'dorado' | 'verde' | 'azul' | 'rojo';
  cargando?: boolean;
}

const COLORES = {
  dorado: { fondo: 'rgba(184,151,90,0.1)',  borde: 'rgba(184,151,90,0.3)',  texto: '#B8975A' },
  verde:  { fondo: 'rgba(45,120,80,0.1)',   borde: 'rgba(45,120,80,0.3)',   texto: '#2D7850' },
  azul:   { fondo: 'rgba(30,45,100,0.1)',   borde: 'rgba(30,45,100,0.3)',   texto: '#1E2D64' },
  rojo:   { fondo: 'rgba(180,50,50,0.1)',   borde: 'rgba(180,50,50,0.3)',   texto: '#B43232' },
};

export default function TarjetaKPI({
  titulo,
  valor,
  formatoCRC = false,
  variacion,
  icono,
  color = 'dorado',
  cargando = false,
}: PropsTarjetaKPI) {
  const palette = COLORES[color];
  const valorFormateado = formatoCRC
    ? formatearCRC(Number(valor))
    : valor;

  if (cargando) {
    return (
      <div className="kpi-tarjeta">
        <div className="esqueleto-linea esqueleto-corta" style={{ marginBottom: '0.75rem' }} />
        <div className="esqueleto-linea esqueleto-larga" style={{ height: '2rem' }} />
        <div className="esqueleto-linea esqueleto-media" style={{ marginTop: '0.5rem' }} />
      </div>
    );
  }

  return (
    <div className="kpi-tarjeta animar-entrada">
      <div className="kpi-encabezado">
        <span className="kpi-titulo">{titulo}</span>
        <div className="kpi-icono-envoltorio" style={{ background: palette.fondo, border: `1px solid ${palette.borde}` }}>
          <span style={{ color: palette.texto }}>{icono}</span>
        </div>
      </div>

      <p className="kpi-valor">{valorFormateado}</p>

      {variacion !== undefined && (
        <div className={`kpi-variacion ${variacion >= 0 ? 'kpi-variacion-positiva' : 'kpi-variacion-negativa'}`}>
          <span>{variacion >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(variacion)}% vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
