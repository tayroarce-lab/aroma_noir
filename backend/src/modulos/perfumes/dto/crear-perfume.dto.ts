import { IsString, IsNotEmpty, IsNumber, IsPositive, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CrearPerfumeDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  marcaId: string;

  @IsString()
  @IsIn(['Arabe', 'Nicho', 'Diseñador'])
  clasificacion: string;

  @IsString()
  @IsIn(['Masculino', 'Femenino', 'Unisex'])
  genero: string;

  @IsString()
  @IsIn(['Parfum', 'EDP', 'EDT', 'EDC', 'Colonia'])
  concentracion: string;

  @IsNumber()
  @IsPositive()
  volumenMl: number;

  @IsString()
  @IsIn(['Floral', 'Oriental', 'Amaderado', 'Fresco', 'Citrico', 'Acuático', 'Gourmand', 'Fougère'])
  familiaOlfativa: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsNumber()
  @IsPositive()
  precioProveedorCrc: number;

  @IsNumber()
  @IsPositive()
  precioVentaCrc: number;

  @IsBoolean()
  @IsOptional()
  stockProveedor?: boolean;
}
