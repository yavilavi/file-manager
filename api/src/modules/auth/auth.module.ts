/**
 * File Manager - auth.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthApplicationService } from './presentation/services/auth-application.service';
import { UsersModule } from '@modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './infrastructure/passport/local.strategy';
import { JwtStrategy } from './infrastructure/passport/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';

import { PrismaService } from '@libs/database/prisma/prisma.service';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { PermissionGuard } from './presentation/guards/permission.guard';
import { TenantModule } from '@modules/tenant/tenant.module';
// Use cases and services
import { AuthenticationUseCase } from './application/use-cases/authentication.use-case';
import { CompanyOnboardingUseCase } from './application/use-cases/company-onboarding.use-case';
import { ArgonPasswordHashingService } from '@shared/services/argon-password-hashing.service';
import { PASSWORD_HASHING_SERVICE } from '@shared/interfaces/password-hashing.interface';
import { USER_REPOSITORY } from '@shared/interfaces/user-repository.interface';
import { PrismaUserRepository } from '@shared/infrastructure/repositories/prisma-user.repository';
import { UserMapper } from '@shared/mappers/user.mapper';
// Domain services and repositories
import { AuthenticationDomainService } from './domain/services/authentication.domain-service';
import { UserCredentialsRepository } from './infrastructure/repositories/user-credentials.repository';
import { USER_CREDENTIALS_REPOSITORY } from './domain/repositories/user-credentials.repository.interface';
// Application services
import { JwtApplicationService } from './application/services/jwt.service';

@Module({
  imports: [UsersModule, PassportModule, PermissionsModule, TenantModule],
  providers: [
    PrismaService,
    AuthApplicationService,
    LocalStrategy,
    JwtStrategy,
    // Use cases
    AuthenticationUseCase,
    CompanyOnboardingUseCase,
    // Domain services
    AuthenticationDomainService,
    // Application services
    JwtApplicationService,
    // Services
    {
      provide: PASSWORD_HASHING_SERVICE,
      useClass: ArgonPasswordHashingService,
    },
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: USER_CREDENTIALS_REPOSITORY,
      useClass: UserCredentialsRepository,
    },
    // Mappers
    UserMapper,
    // Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
