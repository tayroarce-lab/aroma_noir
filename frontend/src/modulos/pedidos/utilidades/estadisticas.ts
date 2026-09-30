import type { EstadoPedido, PedidoPanel } from '../tipos/Pedido.tipos';

export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  pendiente_verificar_stock: 'Verificando stock',
  esperando_pago: 'Esperando pago',
  comprobante_en_revision: 'Comprobante en revisión',
  pagado: 'Pagado',
  enviado_a_proveedor: 'Enviado al proveedor',
  entregado: 'Entregado',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
};

/** Estados que cuentan como venta confirmada (el dinero ya se verificó). */
export const ESTADOS_VENTA: EstadoPedido[] = ['pagado', 'enviado_a_proveedor', 'entregado'];
/** Estados en los que el pedido sigue abierto. */
export const ESTADOS_ABIERTOS: EstadoPedido[] = [
  'pendiente_verificar_stock',
  'esperando_pago',
  'comprobante_en_revision',
];
/** Estados que requieren que una persona del equipo haga algo. */
export const ESTADOS_ACCION: EstadoPedido[] = [
  'pendiente_verificar_stock',
  'comprobante_en_revision',
  'pagado',
];

export const PROVINCIAS = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
] as const;
export type Provincia = (typeof PROVINCIAS)[number];

function sinTildes(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function normalizarProvincia(texto: string | null): Provincia | null {
  if (!texto) return null;
  const t = sinTildes(texto);
  if (t.includes('san jose') || t === 'sj') return 'San José';
  if (t.includes('alajuela')) return 'Alajuela';
  if (t.includes('cartago')) return 'Cartago';
  if (t.includes('heredia')) return 'Heredia';
  if (t.includes('guanacaste')) return 'Guanacaste';
  if (t.includes('puntarenas')) return 'Puntarenas';
  if (t.includes('limon')) return 'Limón';
  return null;
}

export interface ConteoPerfume {
  clave: string;
  perfume: string;
  marca: string;
  unidades: number;
  ingresos: number;
}

export interface EstadisticaZona {
  provincia: Provincia;
  pedidos: number;
  ingresos: number;
  cantones: { canton: string; pedidos: number }[];
  perfumes: ConteoPerfume[];
}

function acumularPerfumes(pedidos: PedidoPanel[]): ConteoPerfume[] {
  const mapa = new Map<string, ConteoPerfume>();
  for (const p of pedidos) {
    for (const it of p.items) {
      const nombre = it.concentracion ? `${it.perfume} ${it.concentracion}` : it.perfume;
      const clave = `${it.marca}|${nombre}`;
      const actual =
        mapa.get(clave) ?? { clave, perfume: nombre, marca: it.marca, unidades: 0, ingresos: 0 };
      actual.unidades += it.cantidad;
      actual.ingresos += it.cantidad * it.precio;
      mapa.set(clave, actual);
    }
  }
  return [...mapa.values()].sort((a, b) => b.unidades - a.unidades || b.ingresos - a.ingresos);
}

export interface ResumenPanel {
  ventas: PedidoPanel[];
  ingresos: number;
  ticketPromedio: number;
  abiertos: number;
  requierenAccion: number;
  topPerfumes: ConteoPerfume[];
  zonas: EstadisticaZona[];
  ventasSinZona: number;
}

export function resumir(pedidos: PedidoPanel[]): ResumenPanel {
  const ventas = pedidos.filter((p) => ESTADOS_VENTA.includes(p.estado));
  const ingresos = ventas.reduce((a, p) => a + p.total, 0);

  const porProvincia = new Map<Provincia, PedidoPanel[]>();
  let sinZona = 0;
  for (const v of ventas) {
    const prov = normalizarProvincia(v.provincia);
    if (!prov) {
      sinZona++;
      continue;
    }
    porProvincia.set(prov, [...(porProvincia.get(prov) ?? []), v]);
  }

  const zonas: EstadisticaZona[] = [...porProvincia.entries()]
    .map(([provincia, lista]) => {
      const cantones = new Map<string, number>();
      for (const v of lista) {
        const c = (v.canton ?? '').trim() || 'Sin cantón';
        cantones.set(c, (cantones.get(c) ?? 0) + 1);
      }
      return {
        provincia,
        pedidos: lista.length,
        ingresos: lista.reduce((a, p) => a + p.total, 0),
        cantones: [...cantones.entries()]
          .map(([canton, n]) => ({ canton, pedidos: n }))
          .sort((a, b) => b.pedidos - a.pedidos),
        perfumes: acumularPerfumes(lista),
      };
    })
    .sort((a, b) => b.pedidos - a.pedidos || b.ingresos - a.ingresos);

  return {
    ventas,
    ingresos,
    ticketPromedio: ventas.length ? Math.round(ingresos / ventas.length) : 0,
    abiertos: pedidos.filter((p) => ESTADOS_ABIERTOS.includes(p.estado)).length,
    requierenAccion: pedidos.filter((p) => ESTADOS_ACCION.includes(p.estado)).length,
    topPerfumes: acumularPerfumes(ventas),
    zonas,
    ventasSinZona: sinZona,
  };
}
