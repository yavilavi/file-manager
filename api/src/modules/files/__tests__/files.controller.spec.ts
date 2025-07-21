/**
 * File Manager - files.controller.spec Tests
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files-service';
import { NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { FilesController } from '../presentation/files.controller';

describe('FilesController', () => {
  let controller: FilesController;
  let mockFilesService: jest.Mocked<FilesService>;
  let mockJwtService: jest.Mocked<JwtService>;

  const mockFileWithRelations = {
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
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      department: {
        id: 1,
        name: 'Test Department',
      },
    },
    company: {
      id: 1,
      name: 'Test Company',
      tenantId: 'test-tenant',
      nit: '123456789',
    },
  };

  const mockRequest = {
    tenantId: 'test-tenant',
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      department: {
        id: 1,
        name: 'Test Department',
      },
    },
    company: {
      id: 1,
      name: 'Test Company',
      tenantId: 'test-tenant',
      nit: '123456789',
    },
  } as unknown as Request;

  beforeEach(async () => {
    mockFilesService = {
      getAllFiles: jest.fn(),
      getFileById: jest.fn(),
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      downloadFile: jest.fn(),
      getFileVersions: jest.fn(),
    } as any;

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFiles', () => {
    it('should return all files for a tenant', async () => {
      const mockFiles = [mockFileWithRelations];
      mockFilesService.getAllFiles.mockResolvedValue(mockFiles);

      const result = await controller.getAllFiles(mockRequest);

      expect(result).toEqual(mockFiles);
      expect(mockFilesService.getAllFiles).toHaveBeenCalledWith(
        mockRequest.tenantId,
      );
    });
  });

  describe('getFileById', () => {
    it('should return a file when it exists', async () => {
      mockFilesService.getFileById.mockResolvedValue(mockFileWithRelations);

      const result = await controller.getFileById(1, mockRequest);

      expect(result).toEqual(mockFileWithRelations);
      expect(mockFilesService.getFileById).toHaveBeenCalledWith(
        1,
        mockRequest.tenantId,
      );
    });

    it('should throw NotFoundException when file does not exist', async () => {
      mockFilesService.getFileById.mockRejectedValue(new NotFoundException());

      await expect(controller.getFileById(1, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      mockFilesService.deleteFile.mockResolvedValue(undefined);

      await controller.deleteFile(1, mockRequest);

      expect(mockFilesService.deleteFile).toHaveBeenCalledWith(
        1,
        mockRequest.tenantId,
      );
    });

    it('should throw NotFoundException when file does not exist', async () => {
      mockFilesService.deleteFile.mockRejectedValue(new NotFoundException());

      await expect(controller.deleteFile(1, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
