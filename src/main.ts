import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  HttpStatus,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as console from 'node:console';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const corsOriginRegex = configService.getOrThrow<string>('corsOriginRegex');
  const allowedOrigins = configService.getOrThrow<string>('allowedOrigins');
  const originRegex = corsOriginRegex ? new RegExp(corsOriginRegex) : null;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  );
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      console.log({ origin, originRegex, allowedOrigins });
      if (!origin || !originRegex || !allowedOrigins)
        return callback(null, true);
      console.log(originRegex);
      if (originRegex.test(origin) || allowedOrigins.includes(origin)) {
        console.log(origin);
        callback(null, true);
      } else {
        callback(new UnauthorizedException('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useBodyParser('text');
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((e) => console.error(e));
