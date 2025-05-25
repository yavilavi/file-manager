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
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@modules/auth/passport/strategies/local.strategy';
import { JwtStrategy } from '@modules/auth/passport/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth/jwt-auth.guard';
import { CompanyModule } from '@modules/company/company.module';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { PermissionGuard } from './guards/permission/permission.guard';
import { TenantModule } from '@modules/tenant/tenant.module';
// New use cases and services
import { AuthenticationUseCase } from './application/use-cases/authentication.use-case';
import { UserRegistrationUseCase } from './application/use-cases/user-registration.use-case';
import { CompanyCreationUseCase } from './application/use-cases/company-creation.use-case';
import { CompanyOnboardingUseCase } from './application/use-cases/company-onboarding.use-case';
import { ArgonPasswordHashingService } from '@shared/services/argon-password-hashing.service';
import { PASSWORD_HASHING_SERVICE } from '@shared/interfaces/password-hashing.interface';
import { USER_REPOSITORY } from '@shared/interfaces/user-repository.interface';
import { COMPANY_REPOSITORY } from '@shared/interfaces/company-repository.interface';
import { PrismaUserRepository } from '@shared/infrastructure/repositories/prisma-user.repository';
import { PrismaCompanyRepository } from '@shared/infrastructure/repositories/prisma-company.repository';
import { UserMapper } from '@shared/mappers/user.mapper';
import { CompanyMapper } from '@shared/mappers/company.mapper';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    CompanyModule,
    PermissionsModule,
    TenantModule,
  ],
  providers: [
    PrismaService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // Use cases
    AuthenticationUseCase,
    UserRegistrationUseCase,
    CompanyCreationUseCase,
    CompanyOnboardingUseCase,
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
      provide: COMPANY_REPOSITORY,
      useClass: PrismaCompanyRepository,
    },
    // Mappers
    UserMapper,
    CompanyMapper,
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
