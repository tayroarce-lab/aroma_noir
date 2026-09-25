'use client';

import type { ClasificacionPerfume, FamiliaOlfativa, GeneroPerfume } from '../tipos/Perfume.tipos';

interface PropsFiltros {
  clasificacion?: ClasificacionPerfume;
  genero?: GeneroPerfume;
  familiaOlfativa?: FamiliaOlfativa;
  onClasificacion: (v: ClasificacionPerfume | undefined) => void;
  onGenero: (v: GeneroPerfume | undefined) => void;
  onFamilia: (v: FamiliaOlfativa | undefined) => void;
  onLimpiar: () => void;
  hayFiltrosActivos: boolean;
  total: number;
}

const CLASIFICACIONES: { valor: ClasificacionPerfume; etiqueta: string; color: string }[] = [
  { valor: 'Nicho',     etiqueta: 'Nicho',      color: 'nicho' },
  { valor: 'Arabe',     etiqueta: 'Árabe',       color: 'arabe' },
  { valor: 'Diseñador', etiqueta: 'Diseñador',   color: 'disenador' },
];

const GENEROS: { valor: GeneroPerfume; etiqueta: string }[] = [
  { valor: 'Masculino', etiqueta: '♂ Masculino' },
  { valor: 'Femenino',  etiqueta: '♀ Femenino' },
  { valor: 'Unisex',    etiqueta: '⊕ Unisex' },
];

const FAMILIAS: FamiliaOlfativa[] = [
  'Floral', 'Oriental', 'Amaderado', 'Fresco', 'Citrico', 'Acuático', 'Gourmand', 'Fougère',
];

export default function Filtros({
  clasificacion,
  genero,
  familiaOlfativa,
  onClasificacion,
  onGenero,
  onFamilia,
  onLimpiar,
  hayFiltrosActivos,
  total,
}: PropsFiltros) {
  return (
    <aside className="filtros-contenedor">

      {/* Clasificación */}
      <div className="filtros-seccion">
        <h3 className="filtros-titulo">Colección</h3>
        <div className="filtros-chips">
          {CLASIFICACIONES.map(({ valor, etiqueta, color }) => (
            <button
              key={valor}
              onClick={() => onClasificacion(clasificacion === valor ? undefined : valor)}
              className={`chip-clasificacion chip-${color} ${clasificacion === valor ? 'chip-activo' : ''}`}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </div>

      {/* Género */}
      <div className="filtros-seccion">
        <h3 className="filtros-titulo">Género</h3>
        <div className="filtros-lista">
          {GENEROS.map(({ valor, etiqueta }) => (
            <button
              key={valor}
              onClick={() => onGenero(genero === valor ? undefined : valor)}
              className={`filtro-opcion ${genero === valor ? 'filtro-opcion-activo' : ''}`}
            >
              <span className="filtro-radio" />
              {etiqueta}
            </button>
          ))}
        </div>
      </div>

      {/* Familia Olfativa */}
      <div className="filtros-seccion">
        <h3 className="filtros-titulo">Familia Olfativa</h3>
        <div className="filtros-lista">
          {FAMILIAS.map((f) => (
            <button
              key={f}
              onClick={() => onFamilia(familiaOlfativa === f ? undefined : f)}
              className={`filtro-opcion ${familiaOlfativa === f ? 'filtro-opcion-activo' : ''}`}
            >
              <span className="filtro-radio" />
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados + Limpiar */}
      <div className="filtros-footer">
        <span className="filtros-total">{total} {total === 1 ? 'resultado' : 'resultados'}</span>
        {hayFiltrosActivos && (
          <button onClick={onLimpiar} className="btn-limpiar">
            Limpiar filtros
          </button>
        )}
      </div>
    </aside>
  );
}
