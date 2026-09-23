import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PedidosServicio } from './pedidos.servicio';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';
import { FiltrarPedidosDto } from './dto/filtrar-pedidos.dto';

@Controller('pedidos')
export class PedidosControlador {
  constructor(private readonly pedidosServicio: PedidosServicio) {}

  /**
   * GET /api/v1/pedidos
   * Lista todos los pedidos (panel de admin).
   * Query params: ?estadoPagoSinpe=PENDIENTE&estadoDespacho=NO_ENVIADO&busqueda=Ana
   */
  @Get()
  obtenerTodos(@Query() filtros: FiltrarPedidosDto) {
    return this.pedidosServicio.obtenerTodos(filtros);
  }

  /**
   * GET /api/v1/pedidos/pendientes
   * Conteo rápido de pedidos que requieren acción del admin.
   */
  @Get('pendientes')
  contarPendientes() {
    return this.pedidosServicio.contarPendientes();
  }

  /**
   * GET /api/v1/pedidos/:id
   * Detalle de un pedido específico.
   */
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.pedidosServicio.obtenerPorId(id);
  }

  /**
   * POST /api/v1/pedidos
   * Registra un nuevo pedido (llamado desde el webhook del chatbot).
   */
  @Post()
  crear(@Body() dto: CrearPedidoDto) {
    return this.pedidosServicio.crear(dto);
  }

  /**
   * PATCH /api/v1/pedidos/:id/estado
   * Actualiza el estado de pago y/o despacho.
   * Body: { estadoPagoSinpe?: 'CONFIRMADO', estadoDespacho?: 'ENVIADO' }
   */
  @Patch(':id/estado')
  actualizarEstado(
    @Param('id') id: string,
    @Body() dto: ActualizarEstadoDto,
  ) {
    return this.pedidosServicio.actualizarEstado(id, dto);
  }
}

