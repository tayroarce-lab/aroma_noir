import { IsString, IsOptional, IsIn } from 'class-validator';

export class FiltrarPerfumesDto {
  @IsOptional()
  @IsString()
  @IsIn(['Arabe', 'Nicho', 'Diseñador'])
  clasificacion?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Masculino', 'Femenino', 'Unisex'])
  genero?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Floral', 'Oriental', 'Amaderado', 'Fresco', 'Citrico', 'Acuático', 'Gourmand', 'Fougère'])
  familiaOlfativa?: string;

  @IsOptional()
  @IsString()
  marcaId?: string;

  @IsOptional()
  @IsString()
  busqueda?: string;
}
