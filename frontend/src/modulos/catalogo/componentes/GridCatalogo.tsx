'use client';

import type { Perfume } from '../tipos/Perfume.tipos';
import TarjetaPerfume from './TarjetaPerfume';
import { generarEnlaceWhatsappTexto } from '@/modulos/carrito/utilidades/generarEnlaceWhatsapp';
import { generarEnlaceInstagram } from '@/modulos/carrito/utilidades/generarEnlaceInstagram';

interface PropsGridCatalogo {
  perfumes: Perfume[];
  cargando?: boolean;
  busqueda?: string;
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

export function EstadoVacio({ busqueda }: { busqueda?: string }) {
  const mensajeWhatsapp = busqueda?.trim()
    ? `Hola, busco "${busqueda.trim()}" y no lo veo en el catálogo de Aroma Noir. ¿Lo tienen?`
    : 'Hola, busco un perfume que no veo en el catálogo de Aroma Noir. ¿Lo tienen?';

  const enlaceWhatsapp = generarEnlaceWhatsappTexto(mensajeWhatsapp);
  const enlaceInstagram = generarEnlaceInstagram();

  return (
    <div className="catalogo-vacio animar-entrada">
      <div className="vacio-icono">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <path d="M28 40 Q40 28 52 40 Q40 52 28 40Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
          <line x1="28" y1="28" x2="52" y2="52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="vacio-titulo">Sin resultados</h3>
      <p className="vacio-descripcion">
        No encontramos ese perfume en el catálogo, pero probablemente lo tenemos — escribinos por
        WhatsApp o Instagram y te confirmamos.
      </p>
      <div className="vacio-acciones">
        <a
          href={enlaceWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="vacio-btn-whatsapp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
            <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.954.558 3.824 1.62 5.433L2.052 22l4.686-1.536a9.98 9.98 0 005.293 1.567h.004c5.534 0 10.03-4.495 10.03-10.03 0-2.68-1.043-5.197-2.937-7.091A9.97 9.97 0 0012.031 2zm0 18.358h-.003a8.3 8.3 0 01-4.227-1.157l-.303-.18-3.14.823.838-3.059-.197-.314a8.307 8.307 0 01-1.275-4.44c0-4.596 3.74-8.337 8.34-8.337 2.227 0 4.321.868 5.895 2.443a8.29 8.29 0 012.44 5.898c0 4.597-3.74 8.323-8.331 8.323z" />
          </svg>
          Consultar por WhatsApp
        </a>
        <a
          href={enlaceInstagram}
          target="_blank"
          rel="noopener noreferrer"
          className="vacio-btn-instagram"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Escribir por Instagram
        </a>
      </div>
    </div>
  );
}

export default function GridCatalogo({
  perfumes,
  cargando = false,
  busqueda,
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
    return <EstadoVacio busqueda={busqueda} />;
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
