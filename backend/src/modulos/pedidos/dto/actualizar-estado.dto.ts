import { IsEnum, IsOptional } from 'class-validator';

export enum EstadoPagoSinpe {
  PENDIENTE  = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
}

export enum EstadoDespacho {
  NO_ENVIADO = 'NO_ENVIADO',
  ENVIADO    = 'ENVIADO',
  ENTREGADO  = 'ENTREGADO',
}

export class ActualizarEstadoDto {
  @IsOptional()
  @IsEnum(EstadoPagoSinpe, {
    message: 'estadoPagoSinpe debe ser PENDIENTE o CONFIRMADO',
  })
  estadoPagoSinpe?: EstadoPagoSinpe;

  @IsOptional()
  @IsEnum(EstadoDespacho, {
    message: 'estadoDespacho debe ser NO_ENVIADO, ENVIADO o ENTREGADO',
  })
  estadoDespacho?: EstadoDespacho;
}
