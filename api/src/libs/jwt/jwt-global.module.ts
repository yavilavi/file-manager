import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('jwt.secret'),
          signOptions: {
            expiresIn: '8h',
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
