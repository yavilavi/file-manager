import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FilesModule } from '@modules/files/files-module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    FilesModule,
    AuthModule,
    UsersModule,
    HealthModule,
    TenantModule,
    DepartmentModule,
    EmailModule,
    EventEmitterModule.forRoot(),
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
