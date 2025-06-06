/**
 * File Manager - Main Application Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FilesModule } from '@modules/files/files.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import configuration from './config/configuration';
import { TenantMiddleware } from '@modules/tenant/tenant.middleware';
import { HealthModule } from '@modules/health/health.module';
import { TenantModule } from '@modules/tenant/tenant.module';
import { DepartmentModule } from '@modules/department/department.module';
import { EmailModule } from '@modules/notification/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from '@modules/notification/notification.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtGlobalModule } from '@libs/jwt/jwt-global.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesModule } from '@modules/roles/roles.module';
import { PlanModule } from '@modules/plan/plan.module';
import { CreditsModule } from '@modules/credits/credits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    JwtGlobalModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: seconds(1), limit: 14 },
      { name: 'medium', ttl: seconds(10), limit: 140 },
      { name: 'long', ttl: seconds(60), limit: 840 },
    ]),
    FilesModule,
    AuthModule,
    UsersModule,
    HealthModule,
    TenantModule,
    DepartmentModule,
    EmailModule,
    EventEmitterModule.forRoot(),
    NotificationModule,
    PermissionsModule,
    RolesModule,
    PlanModule,
    CreditsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
