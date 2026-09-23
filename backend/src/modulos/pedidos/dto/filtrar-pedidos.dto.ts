import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoPagoSinpe, EstadoDespacho } from './actualizar-estado.dto';

export class FiltrarPedidosDto {
  @IsOptional()
  @IsEnum(EstadoPagoSinpe)
  estadoPagoSinpe?: EstadoPagoSinpe;

  @IsOptional()
  @IsEnum(EstadoDespacho)
  estadoDespacho?: EstadoDespacho;

  @IsOptional()
  @IsString()
  busqueda?: string;
}
