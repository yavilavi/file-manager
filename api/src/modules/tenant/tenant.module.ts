import { Module } from '@nestjs/common';

// Presentation Layer
import { TenantController } from '@modules/tenant/presentation/tenant.controller';

// Application Layer - Use Cases
import { CheckSubdomainAvailabilityUseCase } from './application/use-cases/check-subdomain-availability.use-case';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { GetTenantByIdUseCase } from './application/use-cases/get-tenant-by-id.use-case';

// Application Layer - Services
import { RoleInitializationService } from './application/services/role-initialization.service';

// Infrastructure Layer
import { TenantRepository } from './infrastructure/repositories/tenant.repository';
import { TenantValidationService } from './infrastructure/services/tenant-validation.service';

// Domain Layer - Repository Interfaces
import { TENANT_REPOSITORY } from './domain/repositories/tenant.repository.interface';
import { TENANT_VALIDATION_SERVICE } from './domain/services/tenant-validation.service.interface';

// External Dependencies
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  controllers: [TenantController],
  providers: [
    // Use Cases
    CheckSubdomainAvailabilityUseCase,
    CreateTenantUseCase,
    GetTenantByIdUseCase,

    // Application Services
    RoleInitializationService,

    // Repository Implementations
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantRepository,
    },

    // Service Implementations
    {
      provide: TENANT_VALIDATION_SERVICE,
      useClass: TenantValidationService,
    },

    // External Dependencies
    PrismaService,
  ],
  exports: [
    // Export use cases for potential use in other modules
    CheckSubdomainAvailabilityUseCase,
    CreateTenantUseCase,
    GetTenantByIdUseCase,

    // Export repository for other modules that might need it
    TENANT_REPOSITORY,

    // Export role initialization service for auth module
    RoleInitializationService,
  ],
})
export class TenantModule {}
