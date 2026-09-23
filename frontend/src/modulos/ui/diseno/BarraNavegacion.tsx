'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PropsBarraNavegacion {
  cantidadCarrito?: number;
  onAbrirCarrito?: () => void;
}

export default function BarraNavegacion({
  cantidadCarrito = 0,
  onAbrirCarrito,
}: PropsBarraNavegacion) {
  const [desplazado, setDesplazado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const manejarScroll = () => setDesplazado(window.scrollY > 20);
    window.addEventListener('scroll', manejarScroll, { passive: true });
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);

  return (
    <header className={`navbar ${desplazado ? 'navbar-desplazada' : ''}`}>
      <div className="navbar-contenedor">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-icono">✦</span>
          <span className="navbar-logo-texto">
            aroma noir<em>.</em>
          </span>
        </Link>

        {/* Navegación desktop */}
        <nav className="navbar-nav" aria-label="Navegación principal">
          <Link href="/" className="navbar-enlace">Catálogo</Link>
          <Link href="/#colecciones" className="navbar-enlace">Colecciones</Link>
          <Link href="/#nosotros" className="navbar-enlace">Nosotros</Link>
        </nav>

        {/* Acciones */}
        <div className="navbar-acciones">
          <button
            onClick={onAbrirCarrito}
            className="navbar-carrito"
            aria-label={`Carrito — ${cantidadCarrito} ${cantidadCarrito === 1 ? 'artículo' : 'artículos'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="navbar-carrito-icono">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cantidadCarrito > 0 && (
              <span className="navbar-carrito-badge">{cantidadCarrito > 9 ? '9+' : cantidadCarrito}</span>
            )}
          </button>

          {/* Botón menú móvil */}
          <button
            className="navbar-menu-btn"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
            aria-expanded={menuAbierto}
          >
            <span className={`hamburguesa ${menuAbierto ? 'hamburguesa-abierta' : ''}`} />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <nav className="navbar-movil" aria-label="Navegación móvil">
          <Link href="/" className="navbar-movil-enlace" onClick={() => setMenuAbierto(false)}>Catálogo</Link>
          <Link href="/#colecciones" className="navbar-movil-enlace" onClick={() => setMenuAbierto(false)}>Colecciones</Link>
          <Link href="/#nosotros" className="navbar-movil-enlace" onClick={() => setMenuAbierto(false)}>Nosotros</Link>
          <button onClick={() => { onAbrirCarrito?.(); setMenuAbierto(false); }} className="navbar-movil-carrito">
            Ver carrito ({cantidadCarrito})
          </button>
        </nav>
      )}
    </header>
  );
}
