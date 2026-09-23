import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaServicio } from '../../base-datos/prisma.servicio';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { ActualizarEstadoDto, EstadoDespacho, EstadoPagoSinpe } from './dto/actualizar-estado.dto';
import { FiltrarPedidosDto } from './dto/filtrar-pedidos.dto';

// Proyección de campos para respuestas del admin
const CAMPOS_PEDIDO_COMPLETO = {
  id: true,
  fechaPedido: true,
  clienteNombre: true,
  clienteWhatsapp: true,
  clienteDireccion: true,
  totalCobradoCrc: true,
  estadoPagoSinpe: true,
  estadoDespacho: true,
  perfume: {
    select: {
      id: true,
      nombre: true,
      concentracion: true,
      volumenMl: true,
      clasificacion: true,
      imagenUrl: true,
      marca: { select: { id: true, nombre: true } },
    },
  },
} as const;

@Injectable()
export class PedidosServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  /**
   * Lista todos los pedidos con filtros opcionales.
   * Endpoint exclusivo del panel de administración.
   */
  async obtenerTodos(filtros: FiltrarPedidosDto) {
    const { estadoPagoSinpe, estadoDespacho, busqueda } = filtros;

    return this.prisma.db.pedido.findMany({
      where: {
        ...(estadoPagoSinpe && { estadoPagoSinpe }),
        ...(estadoDespacho && { estadoDespacho }),
        ...(busqueda && {
          OR: [
            { clienteNombre: { contains: busqueda, mode: 'insensitive' } },
            { clienteWhatsapp: { contains: busqueda } },
            { perfume: { nombre: { contains: busqueda, mode: 'insensitive' } } },
          ],
        }),
      },
      select: CAMPOS_PEDIDO_COMPLETO,
      orderBy: { fechaPedido: 'desc' },
    });
  }

  /**
   * Detalle de un pedido por ID.
   */
  async obtenerPorId(id: string) {
    const pedido = await this.prisma.db.pedido.findUnique({
      where: { id },
      select: CAMPOS_PEDIDO_COMPLETO,
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido "${id}" no encontrado`);
    }

    return pedido;
  }

  /**
   * Registra un nuevo pedido.
   * Se llama desde el webhook del chatbot de WhatsApp cuando confirma el pago.
   */
  async crear(dto: CrearPedidoDto) {
    // Calcular campos financieros requeridos por el schema
    const perfumeCompleto = await this.prisma.db.perfume.findUnique({
      where: { id: dto.perfumeId },
      select: { stockProveedor: true, nombre: true, precioProveedorCrc: true },
    });

    if (!perfumeCompleto) {
      throw new NotFoundException(`Perfume "${dto.perfumeId}" no encontrado`);
    }

    if (!perfumeCompleto.stockProveedor) {
      throw new BadRequestException(
        `El perfume "${perfumeCompleto.nombre}" no tiene stock disponible`,
      );
    }

    const montoAPagarProveedor = perfumeCompleto.precioProveedorCrc;
    const gananciaNetaRetenida = dto.totalCobradoCrc - montoAPagarProveedor;

    return this.prisma.db.pedido.create({
      data: {
        clienteNombre:        dto.clienteNombre,
        clienteWhatsapp:      dto.clienteWhatsapp,
        clienteDireccion:     dto.clienteDireccion,
        perfumeId:            dto.perfumeId,
        totalCobradoCrc:      dto.totalCobradoCrc,
        montoAPagarProveedor,
        gananciaNetaRetenida,
        estadoPagoSinpe: EstadoPagoSinpe.PENDIENTE,
        estadoDespacho:  EstadoDespacho.NO_ENVIADO,
      },
      select: CAMPOS_PEDIDO_COMPLETO,
    });
  }

  /**
   * Actualiza el estado de pago y/o despacho de un pedido.
   * Validación de transiciones de estado permitidas:
   *   Pago:    PENDIENTE → CONFIRMADO (no reversible)
   *   Despacho: NO_ENVIADO → ENVIADO → ENTREGADO (no reversible)
   */
  async actualizarEstado(id: string, dto: ActualizarEstadoDto) {
    const pedido = await this.obtenerPorId(id);

    // Validar transición de estado de pago
    if (dto.estadoPagoSinpe) {
      if (
        pedido.estadoPagoSinpe === EstadoPagoSinpe.CONFIRMADO &&
        dto.estadoPagoSinpe === EstadoPagoSinpe.PENDIENTE
      ) {
        throw new BadRequestException(
          'No se puede revertir un pago ya confirmado',
        );
      }
    }

    // Validar transición de estado de despacho
    if (dto.estadoDespacho) {
      const ORDEN_DESPACHO = [
        EstadoDespacho.NO_ENVIADO,
        EstadoDespacho.ENVIADO,
        EstadoDespacho.ENTREGADO,
      ];

      const actual = ORDEN_DESPACHO.indexOf(
        pedido.estadoDespacho as EstadoDespacho,
      );
      const nuevo = ORDEN_DESPACHO.indexOf(dto.estadoDespacho);

      if (nuevo < actual) {
        throw new BadRequestException(
          `No se puede retroceder el estado de despacho de "${pedido.estadoDespacho}" a "${dto.estadoDespacho}"`,
        );
      }
    }

    return this.prisma.db.pedido.update({
      where: { id },
      data: {
        ...(dto.estadoPagoSinpe && { estadoPagoSinpe: dto.estadoPagoSinpe }),
        ...(dto.estadoDespacho && { estadoDespacho: dto.estadoDespacho }),
      },
      select: CAMPOS_PEDIDO_COMPLETO,
    });
  }

  /**
   * Métricas rápidas: pedidos pendientes que requieren acción del admin.
   */
  async contarPendientes() {
    const [sinConfirmar, sinEnviar] = await Promise.all([
      this.prisma.db.pedido.count({
        where: { estadoPagoSinpe: EstadoPagoSinpe.PENDIENTE },
      }),
      this.prisma.db.pedido.count({
        where: {
          estadoPagoSinpe: EstadoPagoSinpe.CONFIRMADO,
          estadoDespacho: EstadoDespacho.NO_ENVIADO,
        },
      }),
    ]);

    return { sinConfirmar, sinEnviar, total: sinConfirmar + sinEnviar };
  }
}
