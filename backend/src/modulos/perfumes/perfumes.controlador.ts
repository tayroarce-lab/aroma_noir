import { Controller, Get, Param, Query } from '@nestjs/common';
import { PerfumesServicio } from './perfumes.servicio';
import { FiltrarPerfumesDto } from './dto/filtrar-perfumes.dto';

@Controller('perfumes')
export class PerfumesControlador {
  constructor(private readonly perfumesServicio: PerfumesServicio) {}

  /**
   * GET /api/v1/perfumes
   * Catálogo público con filtros opcionales via query params:
   * ?clasificacion=Nicho&genero=Unisex&familiaOlfativa=Oriental&busqueda=oud
   */
  @Get()
  obtenerTodos(@Query() filtros: FiltrarPerfumesDto) {
    return this.perfumesServicio.obtenerTodos(filtros);
  }

  /**
   * GET /api/v1/perfumes/:id
   * Detalle de un perfume específico
   */
  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.perfumesServicio.obtenerPorId(id);
  }
}
