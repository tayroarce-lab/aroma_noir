'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', etiqueta: 'Dashboard',  icono: '◈' },
  { href: '/admin/perfumes', etiqueta: 'Perfumes', icono: '◇' },
  { href: '/admin/pedidos',  etiqueta: 'Pedidos',  icono: '◻' },
  { href: '/',               etiqueta: 'Ver Tienda', icono: '↗' },
];

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();

  return (
    <div className="admin-layout">
      {/* Barra lateral */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="admin-logo-icono">✦</span>
          <div>
            <p className="admin-logo-texto">LuxeParfums</p>
            <p className="admin-logo-subtexto">Panel de Admin</p>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Navegación del panel">
          {NAV_ITEMS.map(({ href, etiqueta, icono }) => (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item ${ruta === href ? 'admin-nav-item-activo' : ''}`}
            >
              <span className="admin-nav-icono">{icono}</span>
              <span>{etiqueta}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-version">v1.0 · LuxeParfums CR</p>
        </div>
      </aside>

      {/* Área principal */}
      <main className="admin-contenido">
        {children}
      </main>
    </div>
  );
}
