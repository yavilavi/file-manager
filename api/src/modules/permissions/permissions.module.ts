/**
 * File Manager - permissions.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { PermissionDomainService } from './domain/services/permission-domain.service';
import { PrismaPermissionRepository } from '@shared/infrastructure/repositories/prisma-permission.repository';
import { PermissionMapper } from '@shared/mappers/permission.mapper';
import { PERMISSION_REPOSITORY } from '@shared/interfaces/permission-repository.interface';

@Module({
  controllers: [PermissionsController],
  providers: [
    PrismaService,
    PermissionsService,
    PermissionDomainService,
    // Repository
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    // Mapper
    PermissionMapper,
  ],
  exports: [PermissionsService, PermissionDomainService, PERMISSION_REPOSITORY],
})
export class PermissionsModule {}
