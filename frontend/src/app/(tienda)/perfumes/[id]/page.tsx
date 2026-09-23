import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATALOGO_PERFUMES, obtenerPerfumePorId } from '@/modulos/catalogo/tipos/datos-catalogo';
import DetallePerfume from '@/modulos/catalogo/componentes/DetallePerfume';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return CATALOGO_PERFUMES.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const perfume = obtenerPerfumePorId(id);
  if (!perfume) {
    return {
      title: 'Perfume no encontrado — Aroma Noir',
    };
  }

  return {
    title: `${perfume.nombre} — ${perfume.marca.nombre} | Aroma Noir`,
    description:
      perfume.descripcion ??
      `${perfume.nombre} de ${perfume.marca.nombre} (${perfume.concentracion}, ${perfume.volumenMl}ml). Perfumes 100% originales en Costa Rica. Deja estela.`,
  };
}

export default async function PaginaDetallePerfume({ params }: Props) {
  const { id } = await params;
  const perfume = obtenerPerfumePorId(id);

  if (!perfume) {
    notFound();
  }

  return <DetallePerfume perfume={perfume} />;
}
