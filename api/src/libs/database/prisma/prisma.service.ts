import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import prismaClient from '@libs/database/prisma/prisma.client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prismaClient = prismaClient;

  get client() {
    return this.prismaClient;
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
  }
}
