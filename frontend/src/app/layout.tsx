import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LuxeParfums CR — Perfumería de Lujo',
  description:
    'Descubre fragancias de nicho, árabes y de diseñador. Entrega a domicilio en Costa Rica. Pago por SINPE Móvil.',
  keywords: 'perfumes, fragancias, nicho, árabe, lujo, Costa Rica, SINPE',
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
