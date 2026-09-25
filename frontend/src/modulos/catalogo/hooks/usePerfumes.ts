'use client';

import { useState, useMemo } from 'react';
import type { Perfume, FiltrosCatalogo } from '../tipos/Perfume.tipos';
import { CATALOGO_PERFUMES } from '../tipos/datos-catalogo';

function ordenarPorDestacado(lista: Perfume[]): Perfume[] {
  return [...lista].sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
}

export function usePerfumes() {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({});
  const [cargando] = useState(false);

  const { perfumes, arabeDisenador, nicho } = useMemo(() => {
    // 1. Filtrado base (género, familia olfativa, marca, búsqueda)
    let base: Perfume[] = CATALOGO_PERFUMES;

    if (filtros.genero) {
      base = base.filter((p) => p.genero === filtros.genero);
    }
    if (filtros.familiaOlfativa) {
      base = base.filter((p) => p.familiaOlfativa === filtros.familiaOlfativa);
    }
    if (filtros.marcaId) {
      base = base.filter((p) => p.marcaId === filtros.marcaId);
    }
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      base = base.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.marca.nombre.toLowerCase().includes(termino) ||
          p.familiaOlfativa.toLowerCase().includes(termino),
      );
    }

    // 2. Grupos para modo dual (Árabe & Diseñador vs Nicho)
    const grupoArabeDisenador = ordenarPorDestacado(
      base.filter((p) => p.clasificacion === 'Arabe' || p.clasificacion === 'Diseñador'),
    );
    const grupoNicho = ordenarPorDestacado(
      base.filter((p) => p.clasificacion === 'Nicho'),
    );

    // 3. Lista plana según filtro de clasificación
    let plana: Perfume[];
    if (filtros.clasificacion) {
      plana = ordenarPorDestacado(base.filter((p) => p.clasificacion === filtros.clasificacion));
    } else {
      plana = [...grupoArabeDisenador, ...grupoNicho];
    }

    return {
      perfumes: plana,
      arabeDisenador: grupoArabeDisenador,
      nicho: grupoNicho,
    };
  }, [filtros]);

  const actualizarFiltro = <K extends keyof FiltrosCatalogo>(
    clave: K,
    valor: FiltrosCatalogo[K] | undefined,
  ) => {
    setFiltros((prev) => ({ ...prev, [clave]: valor }));
  };

  const limpiarFiltros = () => setFiltros({});

  const hayFiltrosActivos = Object.values(filtros).some(
    (v) => v !== undefined && v !== '',
  );

  return {
    perfumes,
    arabeDisenador,
    nicho,
    total: perfumes.length,
    cargando,
    filtros,
    actualizarFiltro,
    limpiarFiltros,
    hayFiltrosActivos,
  };
}
