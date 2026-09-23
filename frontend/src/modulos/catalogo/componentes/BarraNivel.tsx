import type { NivelIntensidad } from '../tipos/Perfume.tipos';

interface PropsBarraNivel {
  etiqueta: string;
  nivel?: NivelIntensidad;
}

export default function BarraNivel({ etiqueta, nivel }: PropsBarraNivel) {
  const segmentos = [1, 2, 3, 4, 5];

  return (
    <div className="barra-nivel">
      <div className="barra-nivel-cabecera">
        <span className="barra-nivel-etiqueta">{etiqueta}</span>
        {nivel === undefined ? (
          <span className="barra-nivel-proximamente">Próximamente</span>
        ) : (
          <span className="barra-nivel-valor">{nivel}/5</span>
        )}
      </div>
      <div
        className="barra-nivel-segmentos"
        role="progressbar"
        aria-label={`${etiqueta}: ${nivel ? `${nivel} de 5` : 'Próximamente'}`}
        aria-valuenow={nivel ?? 0}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        {segmentos.map((num) => {
          const activo = nivel !== undefined && num <= nivel;
          return (
            <span
              key={num}
              className={`barra-nivel-segmento ${activo ? 'barra-nivel-segmento-activo' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}
