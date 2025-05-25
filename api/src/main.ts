/**
 * File Manager - Application Bootstrap
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const allowedWildcardDomains = configService.getOrThrow<string[]>(
    'allowedWildcardDomains',
  );
  const allowedOrigins = configService.getOrThrow<string>('allowedOrigins');
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
      if (!origin) return callback(null, true);
      try {
        if (
          allowedWildcardDomains.some((domain) => origin.endsWith(domain)) ||
          allowedOrigins.includes(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } catch (err) {
        Logger.error(err);
        callback(new Error('Invalid origin'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    optionsSuccessStatus: 204,
  });
  app.useBodyParser('text');
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap().catch((e) => console.error(e));
