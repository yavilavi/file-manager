import { Module } from '@nestjs/common';
import { TenantController } from '@modules/tenant/tenant.controller';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [TenantController],
})
export class TenantModule {}
