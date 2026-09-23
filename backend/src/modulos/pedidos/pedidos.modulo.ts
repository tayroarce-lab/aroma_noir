import { Module } from '@nestjs/common';
import { PedidosControlador } from './pedidos.controlador';
import { PedidosServicio } from './pedidos.servicio';

@Module({
  controllers: [PedidosControlador],
  providers: [PedidosServicio],
  exports: [PedidosServicio],
})
export class PedidosModulo {}
