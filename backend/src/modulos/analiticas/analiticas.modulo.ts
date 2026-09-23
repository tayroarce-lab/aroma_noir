import { Module } from '@nestjs/common';
import { AnaliticasControlador } from './analiticas.controlador';
import { AnaliticasServicio } from './analiticas.servicio';

@Module({
  controllers: [AnaliticasControlador],
  providers: [AnaliticasServicio],
  exports: [AnaliticasServicio],
})
export class AnaliticasModulo {}
