'use client';

import { useState } from 'react';
import type { Perfume } from '../tipos/Perfume.tipos';
import GridCatalogo from './GridCatalogo';

interface PropsSeccionCatalogo {
  titulo: string;
  descripcion?: string;
  perfumes: Perfume[];
  cargando?: boolean;
  busqueda?: string;
  onAgregarAlCarrito?: (perfume: Perfume) => void;
}

export default function SeccionCatalogo({
  titulo,
  descripcion,
  perfumes,
  cargando = false,
  busqueda,
  onAgregarAlCarrito,
}: PropsSeccionCatalogo) {
  const [prevPerfumes, setPrevPerfumes] = useState(perfumes);
  const [cantidadVisible, setCantidadVisible] = useState(24);

  // Resetear a 24 cuando cambie la lista de perfumes por filtros
  if (prevPerfumes !== perfumes) {
    setPrevPerfumes(perfumes);
    setCantidadVisible(24);
  }

  const perfumesMostrados = perfumes.slice(0, cantidadVisible);
  const quedanMas = perfumes.length > cantidadVisible;

  return (
    <section className="seccion-catalogo" aria-label={titulo}>
      <div className="seccion-catalogo-encabezado">
        <h3 className="seccion-catalogo-titulo">{titulo}</h3>
        {descripcion && (
          <p className="seccion-catalogo-descripcion">{descripcion}</p>
        )}
      </div>

      <GridCatalogo
        perfumes={perfumesMostrados}
        cargando={cargando}
        busqueda={busqueda}
        onAgregarAlCarrito={onAgregarAlCarrito}
      />

      {quedanMas && (
        <div className="seccion-catalogo-cargar-mas">
          <button
            type="button"
            onClick={() => setCantidadVisible((prev) => prev + 24)}
            className="btn-cargar-mas"
          >
            Cargar más ({perfumes.length - cantidadVisible} restantes)
          </button>
        </div>
      )}
    </section>
  );
}
