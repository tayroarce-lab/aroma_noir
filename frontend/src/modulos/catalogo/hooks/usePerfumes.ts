'use client';

import { useState, useMemo } from 'react';
import type { Perfume, FiltrosCatalogo } from '../tipos/Perfume.tipos';
import { PERFUMES_SIMULADOS } from '../tipos/datos-simulados';

// En producción, este hook llamaría a la API real:
// import { clienteApi } from '@/lib/clienteApi';
// const { data } = useQuery({ queryKey: ['perfumes', filtros], queryFn: () => clienteApi.obtener('/perfumes') });

export function usePerfumes() {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({});
  const [cargando] = useState(false);

  const perfumesFiltrados = useMemo(() => {
    let resultado: Perfume[] = PERFUMES_SIMULADOS;

    if (filtros.clasificacion) {
      resultado = resultado.filter((p) => p.clasificacion === filtros.clasificacion);
    }
    if (filtros.genero) {
      resultado = resultado.filter((p) => p.genero === filtros.genero);
    }
    if (filtros.familiaOlfativa) {
      resultado = resultado.filter((p) => p.familiaOlfativa === filtros.familiaOlfativa);
    }
    if (filtros.marcaId) {
      resultado = resultado.filter((p) => p.marcaId === filtros.marcaId);
    }
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.marca.nombre.toLowerCase().includes(termino) ||
          p.familiaOlfativa.toLowerCase().includes(termino),
      );
    }

    return resultado;
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
    perfumes: perfumesFiltrados,
    total: perfumesFiltrados.length,
    cargando,
    filtros,
    actualizarFiltro,
    limpiarFiltros,
    hayFiltrosActivos,
  };
}
