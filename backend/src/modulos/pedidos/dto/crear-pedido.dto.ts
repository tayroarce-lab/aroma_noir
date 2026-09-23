import { IsString, IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator';

export class CrearPedidoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
  clienteNombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El WhatsApp del cliente es requerido' })
  clienteWhatsapp: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección de entrega es requerida' })
  clienteDireccion: string;

  @IsUUID('4', { message: 'El ID del perfume debe ser un UUID válido' })
  perfumeId: string;

  @IsNumber({}, { message: 'El total debe ser un número' })
  @Min(1, { message: 'El total debe ser mayor a 0' })
  totalCobradoCrc: number;
}
