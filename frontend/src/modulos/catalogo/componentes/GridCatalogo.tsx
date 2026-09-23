'use client';

import type { Perfume } from '../tipos/Perfume.tipos';
import TarjetaPerfume from './TarjetaPerfume';

interface PropsGridCatalogo {
  perfumes: Perfume[];
  cargando?: boolean;
  onAgregarAlCarrito?: (perfume: Perfume) => void;
}

function EsqueletoTarjeta() {
  return (
    <div className="tarjeta-esqueleto">
      <div className="esqueleto-imagen" />
      <div className="esqueleto-info">
        <div className="esqueleto-linea esqueleto-corta" />
        <div className="esqueleto-linea esqueleto-larga" />
        <div className="esqueleto-linea esqueleto-media" />
        <div className="esqueleto-footer">
          <div className="esqueleto-precio" />
          <div className="esqueleto-boton" />
        </div>
      </div>
    </div>
  );
}

function EstadoVacio() {
  return (
    <div className="catalogo-vacio">
      <div className="vacio-icono">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <path d="M28 40 Q40 28 52 40 Q40 52 28 40Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
          <line x1="28" y1="28" x2="52" y2="52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="vacio-titulo">Sin resultados</h3>
      <p className="vacio-descripcion">
        No encontramos perfumes con los filtros seleccionados.
        <br />Intenta con una combinación diferente.
      </p>
    </div>
  );
}

export default function GridCatalogo({
  perfumes,
  cargando = false,
  onAgregarAlCarrito,
}: PropsGridCatalogo) {
  if (cargando) {
    return (
      <div className="grid-catalogo">
        {Array.from({ length: 8 }).map((_, i) => (
          <EsqueletoTarjeta key={i} />
        ))}
      </div>
    );
  }

  if (perfumes.length === 0) {
    return <EstadoVacio />;
  }

  return (
    <div className="grid-catalogo">
      {perfumes.map((perfume, i) => (
        <TarjetaPerfume
          key={perfume.id}
          perfume={perfume}
          onAgregarAlCarrito={onAgregarAlCarrito}
          indice={i}
        />
      ))}
    </div>
  );
}
