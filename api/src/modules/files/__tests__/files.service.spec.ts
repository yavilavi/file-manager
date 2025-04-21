import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files-service';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '@libs/storage/minio/minio.service';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { File } from '@prisma/client';

describe('FilesService', () => {
  let service: FilesService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockMinioService: jest.Mocked<MinioService>;
  let mockPrismaService: jest.Mocked<PrismaService>;
  let mockJwtService: jest.Mocked<JwtService>;

  const mockFile: File = {
    id: 1,
    name: 'test.pdf',
    extension: 'pdf',
    path: '/test/path',
    hash: 'test-hash',
    size: 1024,
    mimeType: 'application/pdf',
    documentType: 'document',
    userId: 1,
    tenantId: 'test-tenant',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
      getOrThrow: jest.fn(),
    } as any;

    mockMinioService = {
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
    } as any;

    const mockPrismaClient = {
      file: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      fileVersion: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    mockPrismaService = {
      client: mockPrismaClient,
    } as any;

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: MinioService,
          useValue: mockMinioService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFileById', () => {
    it('should return a file when it exists', async () => {
      (mockPrismaService.client.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      const result = await service.getFileById(1, 'test-tenant');

      expect(result).toEqual(mockFile);
      expect(mockPrismaService.client.file.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          tenantId: 'test-tenant',
          deletedAt: null,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              nit: true,
              tenantId: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw NotFoundException when file does not exist', async () => {
      (mockPrismaService.client.file.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getFileById(1, 'test-tenant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllFiles', () => {
    it('should return all files for a tenant', async () => {
      (mockPrismaService.client.file.findMany as jest.Mock).mockResolvedValue([mockFile]);

      const result = await service.getAllFiles('test-tenant');

      expect(result).toEqual([mockFile]);
      expect(mockPrismaService.client.file.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'test-tenant',
          deletedAt: null,
        },
        orderBy: {
          name: 'asc',
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              nit: true,
              tenantId: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        relationLoadStrategy: 'join',
      });
    });
  });
}); 