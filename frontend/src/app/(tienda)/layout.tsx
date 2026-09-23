'use client';

import BarraNavegacion from '@/modulos/ui/diseno/BarraNavegacion';
import CajonCarrito from '@/modulos/carrito/componentes/CajonCarrito';
import { useCarritoEstado } from '@/modulos/carrito/estado/useCarritoEstado';

function formatearWhatsApp(numero?: string): string {
  if (!numero) return '+506 0000-0000';
  const digitos = numero.replace(/\D/g, '');
  if (digitos.startsWith('506') && digitos.length === 11) {
    return `+506 ${digitos.slice(3, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 8) {
    return `+506 ${digitos.slice(0, 4)}-${digitos.slice(4)}`;
  }
  if (numero.startsWith('+')) return numero;
  return `+${numero}`;
}

function LayoutTiendaContenido({ children }: { children: React.ReactNode }) {
  const { cantidadItems, abrirCarrito } = useCarritoEstado();
  const whatsappFormateado = formatearWhatsApp(process.env.NEXT_PUBLIC_WHATSAPP_NUMERO);

  return (
    <div className="tienda-tema">
      <BarraNavegacion
        cantidadCarrito={cantidadItems()}
        onAbrirCarrito={abrirCarrito}
      />
      <CajonCarrito />
      <main className="layout-principal">{children}</main>
      <footer className="pie-pagina">
        <div className="pie-contenedor">
          <div className="pie-marca">
            <span className="pie-logo">aroma noir<em>.</em></span>
            <p className="pie-descripcion">
              Perfumes 100% originales, entrega a todo Costa Rica.
              <br />Deja estela.
            </p>
          </div>
          <div className="pie-info">
            <p className="pie-contacto">📱 WhatsApp: {whatsappFormateado}</p>
            <p className="pie-legal">
              © {new Date().getFullYear()} Aroma Noir. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LayoutTienda({ children }: { children: React.ReactNode }) {
  return <LayoutTiendaContenido>{children}</LayoutTiendaContenido>;
}

