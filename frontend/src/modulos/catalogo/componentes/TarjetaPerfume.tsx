'use client';

import Link from 'next/link';
import type { Perfume } from '../tipos/Perfume.tipos';
import { formatearCRC } from '@/lib/formateadores';

interface PropsTarjetaPerfume {
  perfume: Perfume;
  onAgregarAlCarrito?: (perfume: Perfume) => void;
  indice?: number;
}

const ICONO_CLASIFICACION: Record<string, string> = {
  Nicho: '◆',
  Arabe: '☽',
  'Diseñador': '✦',
};

const ICONO_GENERO: Record<string, string> = {
  Masculino: '♂',
  Femenino: '♀',
  Unisex: '⊕',
};

export default function TarjetaPerfume({
  perfume,
  onAgregarAlCarrito,
  indice = 0,
}: PropsTarjetaPerfume) {
  const claseClasificacion = {
    Nicho: 'badge-nicho',
    Arabe: 'badge-arabe',
    'Diseñador': 'badge-disenador',
  }[perfume.clasificacion] ?? 'badge-nicho';

  return (
    <article
      className="tarjeta"
      style={{ animationDelay: `${indice * 60}ms` }}
    >
      {/* Imagen / Placeholder */}
      <div className="tarjeta-imagen-envoltorio">
        {perfume.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={perfume.imagenUrl}
            alt={`${perfume.marca.nombre} ${perfume.nombre}`}
            className="tarjeta-imagen"
          />
        ) : (
          <div className="tarjeta-imagen-placeholder">
            <div className="tarjeta-placeholder-icono">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="55" rx="22" ry="18" stroke="currentColor" strokeWidth="1.5" />
                <rect x="30" y="22" width="20" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M36 32 Q40 18 44 32" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <line x1="40" y1="10" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="40" cy="55" rx="12" ry="8" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
            <span className="tarjeta-placeholder-marca">{perfume.marca.nombre}</span>
          </div>
        )}

        {/* Badge de clasificación */}
        <span className={`badge-clasificacion ${claseClasificacion} tarjeta-badge`}>
          {ICONO_CLASIFICACION[perfume.clasificacion]} {perfume.clasificacion}
        </span>

        {/* Overlay con botón rápido */}
        <div className="tarjeta-overlay">
          <button
            onClick={() => onAgregarAlCarrito?.(perfume)}
            className="tarjeta-btn-rapido"
            aria-label={`Agregar ${perfume.nombre} al carrito`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="tarjeta-btn-icono">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Información */}
      <div className="tarjeta-info">
        {/* Marca */}
        <p className="tarjeta-marca">{perfume.marca.nombre}</p>

        {/* Nombre */}
        <Link href={`/perfumes/${perfume.id}`} className="tarjeta-nombre-link">
          <h2 className="tarjeta-nombre">{perfume.nombre}</h2>
        </Link>

        {/* Atributos */}
        <div className="tarjeta-atributos">
          <span className="tarjeta-atributo">
            {ICONO_GENERO[perfume.genero]} {perfume.genero}
          </span>
          <span className="tarjeta-separador">·</span>
          <span className="tarjeta-atributo">{perfume.concentracion}</span>
          <span className="tarjeta-separador">·</span>
          <span className="tarjeta-atributo">{perfume.volumenMl} ml</span>
        </div>

        {/* Familia olfativa */}
        <p className="tarjeta-familia">{perfume.familiaOlfativa}</p>

        {/* Precio + CTA */}
        <div className="tarjeta-footer">
          <span className="tarjeta-precio">{formatearCRC(perfume.precioVentaCrc)}</span>
          <button
            onClick={() => onAgregarAlCarrito?.(perfume)}
            className="tarjeta-btn-agregar"
            aria-label={`Agregar ${perfume.nombre} al carrito`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
