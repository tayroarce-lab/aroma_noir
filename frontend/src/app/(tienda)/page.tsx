'use client';

import { usePerfumes } from '@/modulos/catalogo/hooks/usePerfumes';
import GridCatalogo from '@/modulos/catalogo/componentes/GridCatalogo';
import SeccionCatalogo from '@/modulos/catalogo/componentes/SeccionCatalogo';
import BarraBusqueda from '@/modulos/catalogo/componentes/BarraBusqueda';
import Filtros from '@/modulos/catalogo/componentes/Filtros';
import { useCarritoEstado } from '@/modulos/carrito/estado/useCarritoEstado';
import { generarEnlaceWhatsappTexto } from '@/modulos/carrito/utilidades/generarEnlaceWhatsapp';
import type { ClasificacionPerfume, FamiliaOlfativa, GeneroPerfume, Perfume } from '@/modulos/catalogo/tipos/Perfume.tipos';

export default function PaginaInicio() {
  const {
    perfumes,
    arabeDisenador,
    nicho,
    total,
    cargando,
    filtros,
    actualizarFiltro,
    limpiarFiltros,
    hayFiltrosActivos,
  } = usePerfumes();

  const { agregar } = useCarritoEstado();

  const handleAgregarAlCarrito = (perfume: Perfume) => {
    agregar(perfume);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero" id="inicio">
        <div className="hero-contenido animar-entrada">
          <p className="hero-subtitulo">Colección Exclusiva</p>
          <h1 className="hero-titulo">
            El Arte de la
            <br />
            <em>Perfumería de Lujo</em>
          </h1>
          <div className="divisor-dorado" style={{ margin: '1.5rem 0' }} />
          <p className="hero-descripcion">
            Fragancias nicho, árabes y de diseñador entregadas en tu puerta.
            <br />
            Pago seguro por SINPE Móvil.
          </p>
          <a href="#catalogo" className="hero-cta">
            Explorar catálogo
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        <div className="hero-decoracion" aria-hidden="true">
          <div className="hero-circulo hero-circulo-1" />
          <div className="hero-circulo hero-circulo-2" />
          <div className="hero-circulo hero-circulo-3" />
        </div>
      </section>

      {/* Badges colecciones */}
      <section className="colecciones-banner" id="colecciones">
        <div className="colecciones-grid">
          {[
            { clase: 'badge-nicho',     icono: '◆', nombre: 'Nicho',      desc: 'Parfums de Marly · Amouage · Xerjoff' },
            { clase: 'badge-arabe',     icono: '☽', nombre: 'Árabe',       desc: 'Lattafa · Arabian Oud · Al Haramain' },
            { clase: 'badge-disenador', icono: '✦', nombre: 'Diseñador',   desc: 'Dior · Chanel · Versace · Armani' },
          ].map(({ clase, icono, nombre, desc }) => (
            <button
              key={nombre}
              className="coleccion-card"
              onClick={() =>
                actualizarFiltro(
                  'clasificacion',
                  filtros.clasificacion === (nombre === 'Árabe' ? 'Arabe' : nombre as ClasificacionPerfume)
                    ? undefined
                    : (nombre === 'Árabe' ? 'Arabe' : nombre as ClasificacionPerfume),
                )
              }
            >
              <span className={`badge-clasificacion ${clase}`} style={{ fontSize: '0.8rem', padding: '4px 14px' }}>
                {icono} {nombre}
              </span>
              <p className="coleccion-desc">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Catálogo principal */}
      <section className="catalogo-seccion" id="catalogo">
        <div className="catalogo-encabezado">
          <div>
            <h2 className="catalogo-titulo">Catálogo</h2>
            <p className="catalogo-subtitulo">
              {total} {total === 1 ? 'fragancia disponible' : 'fragancias disponibles'}
              {hayFiltrosActivos && ' · Filtros aplicados'}
            </p>
          </div>
          {hayFiltrosActivos && (
            <button onClick={limpiarFiltros} className="btn-limpiar">
              ✕ Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Buscador visible arriba del catálogo completo */}
        <BarraBusqueda
          busqueda={filtros.busqueda}
          onBusqueda={(v) => actualizarFiltro('busqueda', v || undefined)}
        />

        <div className="catalogo-layout">
          {/* Panel de filtros */}
          <Filtros
            clasificacion={filtros.clasificacion}
            genero={filtros.genero}
            familiaOlfativa={filtros.familiaOlfativa}
            onClasificacion={(v) => actualizarFiltro('clasificacion', v as ClasificacionPerfume | undefined)}
            onGenero={(v) => actualizarFiltro('genero', v as GeneroPerfume | undefined)}
            onFamilia={(v) => actualizarFiltro('familiaOlfativa', v as FamiliaOlfativa | undefined)}
            onLimpiar={limpiarFiltros}
            hayFiltrosActivos={hayFiltrosActivos}
            total={total}
          />

          {/* Grilla / Secciones de productos */}
          <div className="catalogo-contenido" style={{ flex: 1, minWidth: 0 }}>
            {!filtros.clasificacion ? (
              // Modo por defecto: dos bloques separados (Árabe & Diseñador arriba, Colección Nicho debajo)
              total === 0 ? (
                <GridCatalogo
                  perfumes={[]}
                  cargando={cargando}
                  busqueda={filtros.busqueda}
                />
              ) : (
                <>
                  {arabeDisenador.length > 0 && (
                    <SeccionCatalogo
                      titulo="Árabe & Diseñador"
                      descripcion="Las fragancias más cotizadas de las mejores casas internacionales y perfumería oriental."
                      perfumes={arabeDisenador}
                      cargando={cargando}
                      busqueda={filtros.busqueda}
                      onAgregarAlCarrito={handleAgregarAlCarrito}
                    />
                  )}
                  {nicho.length > 0 && (
                    <SeccionCatalogo
                      titulo="Colección Nicho"
                      descripcion="Creaciones exclusivas de alta perfumería de autor para coleccionistas y conocedores."
                      perfumes={nicho}
                      cargando={cargando}
                      busqueda={filtros.busqueda}
                      onAgregarAlCarrito={handleAgregarAlCarrito}
                    />
                  )}
                </>
              )
            ) : (
              // Modo con filtro de colección explícito: una sola sección
              <SeccionCatalogo
                titulo={
                  filtros.clasificacion === 'Nicho'
                    ? 'Colección Nicho'
                    : filtros.clasificacion === 'Arabe'
                    ? 'Perfumería Árabe'
                    : 'Perfumería de Diseñador'
                }
                descripcion={
                  filtros.clasificacion === 'Nicho'
                    ? 'Creaciones exclusivas de alta perfumería de autor para coleccionistas y conocedores.'
                    : filtros.clasificacion === 'Arabe'
                    ? 'Fragancias orientales de gran estela, proyección y fijación exquisita.'
                    : 'Grandes clásicos e iconos de la moda y perfumería internacional.'
                }
                perfumes={perfumes}
                cargando={cargando}
                busqueda={filtros.busqueda}
                onAgregarAlCarrito={handleAgregarAlCarrito}
              />
            )}
          </div>
        </div>

        {/* Aviso: catálogo mostrado es una selección, no el inventario completo */}
        <div className="catalogo-aviso-mas">
          <span className="catalogo-aviso-icono">✦</span>
          <p>
            ¿Buscás otro perfume que no ves aquí? No dudés en escribirnos, seguro que lo tenemos 😉
          </p>
          <a
            href={generarEnlaceWhatsappTexto('Hola, busco un perfume que no veo en el catálogo de Aroma Noir.')}
            target="_blank"
            rel="noopener noreferrer"
            className="catalogo-aviso-enlace"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
