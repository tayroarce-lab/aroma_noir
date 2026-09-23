import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseDatosModulo } from './base-datos/base-datos.modulo';
import { PerfumesModulo } from './modulos/perfumes/perfumes.modulo';
import { AnaliticasModulo } from './modulos/analiticas/analiticas.modulo';
import { PedidosModulo } from './modulos/pedidos/pedidos.modulo';

// Módulos de dominio (se activarán en pasos siguientes)
// import { MarcasModulo } from './modulos/marcas/marcas.modulo';
// import { WebhookBotModulo } from './modulos/webhook-bot/webhook.modulo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BaseDatosModulo,
    PerfumesModulo,
    AnaliticasModulo,
    PedidosModulo,
    // MarcasModulo,
    // WebhookBotModulo,
  ],
})
export class AplicacionModulo {}
