'use client';

interface PropsBarraBusqueda {
  busqueda?: string;
  onBusqueda: (valor: string) => void;
  className?: string;
}

export default function BarraBusqueda({
  busqueda,
  onBusqueda,
  className = '',
}: PropsBarraBusqueda) {
  return (
    <div className={`catalogo-barra-busqueda ${className}`.trim()}>
      <div className="buscador-envoltorio">
        <svg
          className="buscador-icono"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar perfume, diseñador o familia olfativa..."
          value={busqueda ?? ''}
          onChange={(e) => onBusqueda(e.target.value)}
          className="buscador-input"
          aria-label="Buscar perfume"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => onBusqueda('')}
            className="buscador-limpiar"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
