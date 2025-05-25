/**
 * File Manager - file.repository Repository
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { FileEntity } from '../../domain/entities/file.entity';
import {
  IFileRepository,
  FileWithRelations,
} from '../../domain/repositories/file.repository.interface';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number, tenantId: string): Promise<FileEntity | null> {
    const file = await this.prisma.client.file.findUnique({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!file) {
      return null;
    }

    return FileEntity.fromPersistence({
      id: file.id,
      name: file.name,
      extension: file.extension,
      mimeType: file.mimeType,
      hash: file.hash,
      size: file.size,
      path: file.path,
      documentType: file.documentType,
      tenantId: file.tenantId,
      userId: file.userId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt,
    });
  }

  async findByHash(hash: string, tenantId: string): Promise<FileEntity | null> {
    const file = await this.prisma.client.file.findFirst({
      where: {
        hash,
        tenantId,
        deletedAt: null,
      },
    });

    if (!file) {
      return null;
    }

    return FileEntity.fromPersistence({
      id: file.id,
      name: file.name,
      extension: file.extension,
      mimeType: file.mimeType,
      hash: file.hash,
      size: file.size,
      path: file.path,
      documentType: file.documentType,
      tenantId: file.tenantId,
      userId: file.userId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt,
    });
  }

  async findAllByTenant(tenantId: string): Promise<FileEntity[]> {
    const files = await this.prisma.client.file.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return files.map((file) =>
      FileEntity.fromPersistence({
        id: file.id,
        name: file.name,
        extension: file.extension,
        mimeType: file.mimeType,
        hash: file.hash,
        size: file.size,
        path: file.path,
        documentType: file.documentType,
        tenantId: file.tenantId,
        userId: file.userId,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        deletedAt: file.deletedAt,
      }),
    );
  }

  async findAllByTenantWithRelations(
    tenantId: string,
  ): Promise<FileWithRelations[]> {
    return await this.prisma.client.file.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
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
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
          },
        },
      },
    });
  }

  async findByIdWithVersions(
    id: number,
    tenantId: string,
  ): Promise<FileEntity | null> {
    const file = await this.prisma.client.file.findUnique({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        versions: true,
      },
    });

    if (!file) {
      return null;
    }

    return FileEntity.fromPersistence({
      id: file.id,
      name: file.name,
      extension: file.extension,
      mimeType: file.mimeType,
      hash: file.hash,
      size: file.size,
      path: file.path,
      documentType: file.documentType,
      tenantId: file.tenantId,
      userId: file.userId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt,
    });
  }

  async save(file: FileEntity): Promise<FileEntity> {
    if (file.id === 0) {
      // Create new file
      const createdFile = await this.prisma.client.file.create({
        data: {
          name: file.name,
          extension: file.extension,
          mimeType: file.mimeType,
          hash: file.hash,
          size: file.size,
          path: file.path,
          documentType: file.documentType,
          tenantId: file.tenantId,
          userId: file.userId,
        },
      });

      return FileEntity.fromPersistence({
        id: createdFile.id,
        name: createdFile.name,
        extension: createdFile.extension,
        mimeType: createdFile.mimeType,
        hash: createdFile.hash,
        size: createdFile.size,
        path: createdFile.path,
        documentType: createdFile.documentType,
        tenantId: createdFile.tenantId,
        userId: createdFile.userId,
        createdAt: createdFile.createdAt,
        updatedAt: createdFile.updatedAt,
        deletedAt: createdFile.deletedAt,
      });
    } else {
      // Update existing file
      const updatedFile = await this.prisma.client.file.update({
        where: { id: file.id },
        data: {
          name: file.name,
          extension: file.extension,
          mimeType: file.mimeType,
          hash: file.hash,
          size: file.size,
          path: file.path,
          documentType: file.documentType,
          updatedAt: new Date(),
          deletedAt: file.deletedAt,
        },
      });

      return FileEntity.fromPersistence({
        id: updatedFile.id,
        name: updatedFile.name,
        extension: updatedFile.extension,
        mimeType: updatedFile.mimeType,
        hash: updatedFile.hash,
        size: updatedFile.size,
        path: updatedFile.path,
        documentType: updatedFile.documentType,
        tenantId: updatedFile.tenantId,
        userId: updatedFile.userId,
        createdAt: updatedFile.createdAt,
        updatedAt: updatedFile.updatedAt,
        deletedAt: updatedFile.deletedAt,
      });
    }
  }

  async delete(id: number, tenantId: string): Promise<void> {
    await this.prisma.client.file.update({
      where: {
        id,
        tenantId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async updateHash(id: number, newHash: string): Promise<void> {
    await this.prisma.client.file.update({
      where: { id },
      data: {
        hash: newHash,
        updatedAt: new Date(),
      },
    });
  }
}
