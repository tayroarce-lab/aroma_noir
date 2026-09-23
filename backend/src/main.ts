import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AplicacionModulo } from './aplicacion.modulo';

async function iniciar() {
  const app = await NestFactory.create(AplicacionModulo);

  // Prefijo global de la API
  app.setGlobalPrefix('api/v1');

  // Validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — Permite peticiones desde el frontend Next.js
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const puerto = process.env.PORT ?? 3001;
  await app.listen(puerto);

  console.log(`🚀 Backend corriendo en: http://localhost:${puerto}/api/v1`);
}

iniciar();
