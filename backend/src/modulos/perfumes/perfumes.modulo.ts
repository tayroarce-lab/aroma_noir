import { Module } from '@nestjs/common';
import { PerfumesControlador } from './perfumes.controlador';
import { PerfumesServicio } from './perfumes.servicio';

@Module({
  controllers: [PerfumesControlador],
  providers: [PerfumesServicio],
  exports: [PerfumesServicio],
})
export class PerfumesModulo {}
