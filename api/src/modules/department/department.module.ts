import { Module } from '@nestjs/common';
import { DepartmentController } from '@modules/department/department.controller';
import { DepartmentService } from '@modules/department/department.service';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, PrismaService],
})
export class DepartmentModule {}
