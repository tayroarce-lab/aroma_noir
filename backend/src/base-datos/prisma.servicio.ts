import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaServicio implements OnModuleInit, OnModuleDestroy {
  private readonly cliente: PrismaClient;

  constructor() {
    this.cliente = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  get db(): PrismaClient {
    return this.cliente;
  }

  async onModuleInit() {
    await this.cliente.$connect();
  }

  async onModuleDestroy() {
    await this.cliente.$disconnect();
  }
}
