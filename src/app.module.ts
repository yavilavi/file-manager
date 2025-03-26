import { Module } from '@nestjs/common';
import { FilesModule } from '@modules/files/files-module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
