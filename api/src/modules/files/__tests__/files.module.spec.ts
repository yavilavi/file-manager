/**
 * File Manager - files.module.spec Tests
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../files-controller';
import { FilesService } from '../files-service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MinioService } from '@libs/storage/minio/minio.service';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('FilesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockMinioService = {
      getClient: jest.fn(),
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
      initBucket: jest.fn(),
    };

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        {
          provide: MinioService,
          useValue: mockMinioService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'minio.endpoint':
                  return 'http://localhost:9000';
                case 'minio.port':
                  return 9000;
                case 'minio.accessKey':
                  return 'minioadmin';
                case 'minio.secretKey':
                  return 'minioadmin';
                case 'minio.bucket':
                  return 'test-bucket';
                case 'minio.useSSL':
                  return false;
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            client: {
              file: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
              },
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        FilesService,
        FilesController,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide FilesController', () => {
    const controller = module.get(FilesController);
    expect(controller).toBeDefined();
  });

  it('should provide FilesService', () => {
    const service = module.get(FilesService);
    expect(service).toBeDefined();
  });
});
