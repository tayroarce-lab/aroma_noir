import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../../base-datos/prisma.servicio';

@Injectable()
export class AnaliticasServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Resumen ejecutivo del negocio: KPIs principales
   */
  async obtenerResumen() {
    const [
      totalPedidos,
      totalProductos,
      ingresoTotal,
      pedidosPendientes,
      pedidosConfirmados,
      pedidosEnviados,
      pedidosEntregados,
    ] = await Promise.all([
      this.prisma.db.pedido.count(),
      this.prisma.db.perfume.count(),
      this.prisma.db.pedido.aggregate({
        _sum: { totalCobradoCrc: true },
        where: { estadoPagoSinpe: 'CONFIRMADO' },
      }),
      this.prisma.db.pedido.count({ where: { estadoPagoSinpe: 'PENDIENTE' } }),
      this.prisma.db.pedido.count({ where: { estadoPagoSinpe: 'CONFIRMADO' } }),
      this.prisma.db.pedido.count({ where: { estadoDespacho: 'ENVIADO' } }),
      this.prisma.db.pedido.count({ where: { estadoDespacho: 'ENTREGADO' } }),
    ]);

    return {
      totalPedidos,
      totalProductos,
      ingresoTotalCrc: ingresoTotal._sum.totalCobradoCrc ?? 0,
      pedidosPendientes,
      pedidosConfirmados,
      pedidosEnviados,
      pedidosEntregados,
      tasaConversion:
        totalPedidos > 0
          ? Number(((pedidosConfirmados / totalPedidos) * 100).toFixed(1))
          : 0,
    };
  }

  /**
   * Ventas por clasificación de perfume (Nicho, Árabe, Diseñador)
   */
  async ventasPorClasificacion() {
    const resultado = await this.prisma.db.pedido.groupBy({
      by: ['perfumeId'],
      _sum: { totalCobradoCrc: true },
      _count: { id: true },
      where: { estadoPagoSinpe: 'CONFIRMADO' },
    });

    // Enriquecer con datos del perfume
    const perfumeIds = resultado.map((r) => r.perfumeId);
    const perfumes = await this.prisma.db.perfume.findMany({
      where: { id: { in: perfumeIds } },
      select: { id: true, clasificacion: true },
    });

    const mapaClasificacion = new Map(
      perfumes.map((p) => [p.id, p.clasificacion]),
    );

    const agrupado: Record<string, { ingresos: number; pedidos: number }> = {
      Nicho: { ingresos: 0, pedidos: 0 },
      Arabe: { ingresos: 0, pedidos: 0 },
      Diseñador: { ingresos: 0, pedidos: 0 },
    };

    for (const fila of resultado) {
      const clasificacion = mapaClasificacion.get(fila.perfumeId);
      if (clasificacion && agrupado[clasificacion]) {
        agrupado[clasificacion].ingresos += fila._sum.totalCobradoCrc ?? 0;
        agrupado[clasificacion].pedidos += fila._count.id;
      }
    }

    return agrupado;
  }

  /**
   * Top 5 perfumes más vendidos (por ingresos confirmados)
   */
  async topPerfumes(limite = 5) {
    const resultado = await this.prisma.db.pedido.groupBy({
      by: ['perfumeId'],
      _sum: { totalCobradoCrc: true },
      _count: { id: true },
      where: { estadoPagoSinpe: 'CONFIRMADO' },
      orderBy: { _sum: { totalCobradoCrc: 'desc' } },
      take: limite,
    });

    const perfumeIds = resultado.map((r) => r.perfumeId);
    const perfumes = await this.prisma.db.perfume.findMany({
      where: { id: { in: perfumeIds } },
      select: { id: true, nombre: true, marca: { select: { nombre: true } }, clasificacion: true },
    });

    const mapaPerfumes = new Map(perfumes.map((p) => [p.id, p]));

    return resultado.map((fila) => ({
      perfume: mapaPerfumes.get(fila.perfumeId),
      ingresosCrc: fila._sum.totalCobradoCrc ?? 0,
      pedidos: fila._count.id,
    }));
  }

  /**
   * Pedidos recientes (últimos 20) para la tabla del dashboard
   */
  async pedidosRecientes(limite = 20) {
    return this.prisma.db.pedido.findMany({
      take: limite,
      orderBy: { fechaPedido: 'desc' },
      select: {
        id: true,
        fechaPedido: true,
        clienteNombre: true,
        clienteWhatsapp: true,
        totalCobradoCrc: true,
        estadoPagoSinpe: true,
        estadoDespacho: true,
        perfume: {
          select: {
            nombre: true,
            marca: { select: { nombre: true } },
            clasificacion: true,
          },
        },
      },
    });
  }

  /**
   * Pedidos de los últimos 7 días (para mini-gráfico de tendencia)
   */
  async tendenciaUltimos7Dias() {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    const pedidos = await this.prisma.db.pedido.findMany({
      where: { fechaPedido: { gte: hace7Dias } },
      select: { fechaPedido: true, totalCobradoCrc: true, estadoPagoSinpe: true },
      orderBy: { fechaPedido: 'asc' },
    });

    // Agrupar por día
    const porDia: Record<string, { pedidos: number; ingresos: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const clave = fecha.toISOString().split('T')[0];
      porDia[clave] = { pedidos: 0, ingresos: 0 };
    }

    for (const pedido of pedidos) {
      const clave = new Date(pedido.fechaPedido).toISOString().split('T')[0];
      if (porDia[clave]) {
        porDia[clave].pedidos += 1;
        if (pedido.estadoPagoSinpe === 'CONFIRMADO') {
          porDia[clave].ingresos += pedido.totalCobradoCrc;
        }
      }
    }

    return Object.entries(porDia).map(([fecha, datos]) => ({ fecha, ...datos }));
  }

  /**
   * Inventario: conteo de perfumes sin stock
   */
  async estadoInventario() {
    const [conStock, sinStock] = await Promise.all([
      this.prisma.db.perfume.count({ where: { stockProveedor: true } }),
      this.prisma.db.perfume.count({ where: { stockProveedor: false } }),
    ]);
    return { conStock, sinStock, total: conStock + sinStock };
  }
}
