import type { AcordePrincipal } from '../tipos/Perfume.tipos';
import { colorDeAcorde } from '../utilidades/coloresAcordes';

interface PropsAcordesPrincipales {
  acordes?: AcordePrincipal[];
}

export default function AcordesPrincipales({ acordes }: PropsAcordesPrincipales) {
  const hayAcordes = acordes && acordes.length > 0;

  return (
    <div className="detalle-bloque-acordes">
      <h2 className="detalle-subtitulo">Acordes Principales</h2>
      {hayAcordes ? (
        <div className="acordes-lista">
          {acordes!.map((acorde) => (
            <div key={acorde.nombre} className="acorde-fila">
              <div
                className="acorde-barra"
                style={{
                  width: `${Math.max(acorde.intensidad, 12)}%`,
                  backgroundColor: colorDeAcorde(acorde.nombre),
                }}
              >
                <span className="acorde-etiqueta">{acorde.nombre}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="detalle-notas-proximamente">
          <span className="detalle-notas-icono">✦</span>
          <p>Acordes próximamente — los estamos documentando.</p>
        </div>
      )}
    </div>
  );
}
