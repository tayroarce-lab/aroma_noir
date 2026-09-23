import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AnaliticasServicio } from './analiticas.servicio';

@Controller('analiticas')
export class AnaliticasControlador {
  constructor(private readonly analiticasServicio: AnaliticasServicio) {}

  /**
   * GET /api/v1/analiticas/resumen
   * KPIs principales del negocio
   */
  @Get('resumen')
  obtenerResumen() {
    return this.analiticasServicio.obtenerResumen();
  }

  /**
   * GET /api/v1/analiticas/clasificaciones
   * Desglose de ventas e ingresos por tipo de perfume
   */
  @Get('clasificaciones')
  ventasPorClasificacion() {
    return this.analiticasServicio.ventasPorClasificacion();
  }

  /**
   * GET /api/v1/analiticas/top-perfumes?limite=5
   * Los N perfumes más rentables
   */
  @Get('top-perfumes')
  topPerfumes(
    @Query('limite', new DefaultValuePipe(5), ParseIntPipe) limite: number,
  ) {
    return this.analiticasServicio.topPerfumes(limite);
  }

  /**
   * GET /api/v1/analiticas/pedidos-recientes?limite=20
   * Tabla de pedidos más recientes
   */
  @Get('pedidos-recientes')
  pedidosRecientes(
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
  ) {
    return this.analiticasServicio.pedidosRecientes(limite);
  }

  /**
   * GET /api/v1/analiticas/tendencia
   * Pedidos e ingresos de los últimos 7 días
   */
  @Get('tendencia')
  tendencia() {
    return this.analiticasServicio.tendenciaUltimos7Dias();
  }

  /**
   * GET /api/v1/analiticas/inventario
   * Estado de stock por proveedor
   */
  @Get('inventario')
  inventario() {
    return this.analiticasServicio.estadoInventario();
  }
}
