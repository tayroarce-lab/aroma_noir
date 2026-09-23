'use client';

import BarraNavegacion from '@/modulos/ui/diseno/BarraNavegacion';
import CajonCarrito from '@/modulos/carrito/componentes/CajonCarrito';
import { useCarritoEstado } from '@/modulos/carrito/estado/useCarritoEstado';

function LayoutTiendaContenido({ children }: { children: React.ReactNode }) {
  const { cantidadItems, abrirCarrito } = useCarritoEstado();

  return (
    <>
      <BarraNavegacion
        cantidadCarrito={cantidadItems()}
        onAbrirCarrito={abrirCarrito}
      />
      <CajonCarrito />
      <main className="layout-principal">{children}</main>
      <footer className="pie-pagina">
        <div className="pie-contenedor">
          <div className="pie-marca">
            <span className="pie-logo">✦ LuxeParfums CR</span>
            <p className="pie-descripcion">
              Perfumería de lujo con entrega a domicilio en Costa Rica.
              <br />Pago seguro por SINPE Móvil.
            </p>
          </div>
          <div className="pie-info">
            <p className="pie-contacto">📱 WhatsApp: +506 0000-0000</p>
            <p className="pie-legal">
              © {new Date().getFullYear()} LuxeParfums CR. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function LayoutTienda({ children }: { children: React.ReactNode }) {
  return <LayoutTiendaContenido>{children}</LayoutTiendaContenido>;
}

