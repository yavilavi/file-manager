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

@Module({
  imports: [UsersModule, PassportModule, CompanyModule, PermissionsModule, TenantModule],
  providers: [
    PrismaService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
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
