'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Perfume } from '../tipos/Perfume.tipos';
import { formatearCRC } from '@/lib/formateadores';
import { useCarritoEstado } from '@/modulos/carrito/estado/useCarritoEstado';
import BarraNivel from './BarraNivel';
import AcordesPrincipales from './AcordesPrincipales';
import PlaceholderPerfume from './PlaceholderPerfume';

interface PropsDetallePerfume {
  perfume: Perfume;
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

export default function DetallePerfume({ perfume }: PropsDetallePerfume) {
  const { agregar, abrirCarrito } = useCarritoEstado();
  const [agregadoReciente, setAgregadoReciente] = useState(false);

  const claseClasificacion = {
    Nicho: 'badge-nicho',
    Arabe: 'badge-arabe',
    'Diseñador': 'badge-disenador',
  }[perfume.clasificacion] ?? 'badge-disenador';

  const handleAgregar = () => {
    agregar(perfume);
    setAgregadoReciente(true);
    setTimeout(() => setAgregadoReciente(false), 2000);
  };

  const handleComprarAhora = () => {
    agregar(perfume);
    abrirCarrito();
  };

  const tieneNotas =
    perfume.notas &&
    ((perfume.notas.salida && perfume.notas.salida.length > 0) ||
      (perfume.notas.corazon && perfume.notas.corazon.length > 0) ||
      (perfume.notas.fondo && perfume.notas.fondo.length > 0));

  return (
    <div className="detalle-seccion">
      <div className="detalle-contenedor">
        {/* Navegación de retorno */}
        <nav className="detalle-migas" aria-label="Ruta de navegación">
          <Link href="/" className="detalle-volver">
            ← Volver al catálogo
          </Link>
          <span className="detalle-separador">/</span>
          <span className="detalle-miga-actual">{perfume.marca.nombre} {perfume.nombre}</span>
        </nav>

        <div className="detalle-layout">
          {/* Columna Izquierda: Imagen */}
          <div className="detalle-columna-visual">
            <div className="detalle-imagen-envoltorio">
              {perfume.imagenUrl ? (
                <Image
                  src={perfume.imagenUrl}
                  alt={`${perfume.marca.nombre} ${perfume.nombre}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="detalle-imagen"
                />
              ) : (
                <PlaceholderPerfume marca={perfume.marca.nombre} className="detalle-placeholder" />
              )}
              <span className={`badge-clasificacion ${claseClasificacion} detalle-badge-flotante`}>
                {ICONO_CLASIFICACION[perfume.clasificacion]} {perfume.clasificacion}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Información y Compra */}
          <div className="detalle-columna-info">
            <p className="detalle-marca">{perfume.marca.nombre}</p>
            <h1 className="detalle-nombre">{perfume.nombre}</h1>

            <div className="detalle-badges">
              <span className="detalle-badge-item">
                {ICONO_GENERO[perfume.genero]} {perfume.genero}
              </span>
              <span className="detalle-badge-item">{perfume.concentracion}</span>
              <span className="detalle-badge-item">{perfume.volumenMl} ml</span>
              <span className="detalle-badge-item">{perfume.familiaOlfativa}</span>
            </div>

            <div className="detalle-precio-bloque">
              <span className="detalle-precio">{formatearCRC(perfume.precioVentaCrc)}</span>
              <span className="detalle-precio-nota">IVA incluido · Envío a todo el país</span>
            </div>

            {perfume.descripcion && (
              <p className="detalle-descripcion">{perfume.descripcion}</p>
            )}

            {/* Acordes principales */}
            <AcordesPrincipales acordes={perfume.acordes} />

            {/* Pirámide Olfativa */}
            <div className="detalle-bloque-notas">
              <h2 className="detalle-subtitulo">Pirámide Olfativa</h2>
              {tieneNotas && perfume.notas ? (
                <div className="detalle-piramide">
                  {perfume.notas.salida && perfume.notas.salida.length > 0 && (
                    <div className="detalle-fase-notas">
                      <span className="detalle-fase-etiqueta">Notas de Salida</span>
                      <div className="detalle-chips">
                        {perfume.notas.salida.map((nota) => (
                          <span key={nota} className="detalle-chip">{nota}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {perfume.notas.corazon && perfume.notas.corazon.length > 0 && (
                    <div className="detalle-fase-notas">
                      <span className="detalle-fase-etiqueta">Notas de Corazón</span>
                      <div className="detalle-chips">
                        {perfume.notas.corazon.map((nota) => (
                          <span key={nota} className="detalle-chip">{nota}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {perfume.notas.fondo && perfume.notas.fondo.length > 0 && (
                    <div className="detalle-fase-notas">
                      <span className="detalle-fase-etiqueta">Notas de Fondo</span>
                      <div className="detalle-chips">
                        {perfume.notas.fondo.map((nota) => (
                          <span key={nota} className="detalle-chip">{nota}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="detalle-notas-proximamente">
                  <span className="detalle-notas-icono">✦</span>
                  <p>Notas próximamente — las estamos documentando.</p>
                </div>
              )}
            </div>

            {/* Rendimiento (Duración y Proyección) */}
            <div className="detalle-bloque-rendimiento">
              <h2 className="detalle-subtitulo">Rendimiento Estimado</h2>
              <div className="detalle-rendimiento-grid">
                <BarraNivel etiqueta="Duración" nivel={perfume.duracion} />
                <BarraNivel etiqueta="Proyección" nivel={perfume.proyeccion} />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="detalle-acciones">
              <button
                type="button"
                onClick={handleAgregar}
                className="detalle-btn-agregar"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 18, height: 18 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {agregadoReciente ? '¡Agregado al carrito!' : 'Agregar al carrito'}
              </button>

              <button
                type="button"
                onClick={handleComprarAhora}
                className="detalle-btn-comprar"
              >
                Comprar ahora
              </button>
            </div>

            {/* Garantías y servicio */}
            <div className="detalle-garantias">
              <div className="detalle-garantia-item">
                <span className="detalle-garantia-icono">✦</span>
                <span>100% Original garantizado</span>
              </div>
              <div className="detalle-garantia-item">
                <span className="detalle-garantia-icono">🚚</span>
                <span>Envíos a toda Costa Rica</span>
              </div>
              <div className="detalle-garantia-item">
                <span className="detalle-garantia-icono">💳</span>
                <span>Pago por SINPE Móvil al confirmar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
