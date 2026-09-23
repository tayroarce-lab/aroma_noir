import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServicio } from '../../base-datos/prisma.servicio';
import { FiltrarPerfumesDto } from './dto/filtrar-perfumes.dto';
import { CrearPerfumeDto } from './dto/crear-perfume.dto';

// Campos que NUNCA se exponen al cliente
const CAMPOS_PUBLICOS_PERFUME = {
  id: true,
  nombre: true,
  clasificacion: true,
  genero: true,
  concentracion: true,
  volumenMl: true,
  familiaOlfativa: true,
  descripcion: true,
  imagenUrl: true,
  precioVentaCrc: true,
  stockProveedor: true,
  marca: {
    select: {
      id: true,
      nombre: true,
    },
  },
} as const;

@Injectable()
export class PerfumesServicio {
  constructor(private readonly prisma: PrismaServicio) {}

  async obtenerTodos(filtros: FiltrarPerfumesDto) {
    const { clasificacion, genero, familiaOlfativa, marcaId, busqueda } = filtros;

    return this.prisma.db.perfume.findMany({
      where: {
        ...(clasificacion && { clasificacion }),
        ...(genero && { genero }),
        ...(familiaOlfativa && { familiaOlfativa }),
        ...(marcaId && { marcaId }),
        ...(busqueda && {
          OR: [
            { nombre: { contains: busqueda, mode: 'insensitive' } },
            { marca: { nombre: { contains: busqueda, mode: 'insensitive' } } },
            { familiaOlfativa: { contains: busqueda, mode: 'insensitive' } },
          ],
        }),
        stockProveedor: true, // Solo mostrar productos con stock
      },
      select: CAMPOS_PUBLICOS_PERFUME,
      orderBy: [{ marca: { nombre: 'asc' } }, { nombre: 'asc' }],
    });
  }

  async obtenerPorId(id: string) {
    const perfume = await this.prisma.db.perfume.findUnique({
      where: { id },
      select: CAMPOS_PUBLICOS_PERFUME,
    });

    if (!perfume) {
      throw new NotFoundException(`Perfume con id "${id}" no encontrado`);
    }

    return perfume;
  }

  // Solo para el panel de administración (incluye campos sensibles)
  async obtenerTodosAdmin() {
    return this.prisma.db.perfume.findMany({
      include: { marca: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async crear(dto: CrearPerfumeDto) {
    const margenGanancia = dto.precioVentaCrc - dto.precioProveedorCrc;

    return this.prisma.db.perfume.create({
      data: {
        ...dto,
        margenGanancia,
      },
    });
  }

  async actualizarStock(id: string, stockProveedor: boolean) {
    return this.prisma.db.perfume.update({
      where: { id },
      data: { stockProveedor },
    });
  }
}
