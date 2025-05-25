/**
 * File Manager - file-version.repository Repository
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { FileVersionEntity } from '../../domain/entities/file-version.entity';
import { IFileVersionRepository } from '../../domain/repositories/file.repository.interface';

@Injectable()
export class FileVersionRepository implements IFileVersionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FileVersionEntity | null> {
    const version = await this.prisma.client.fileVersion.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!version) {
      return null;
    }

    return FileVersionEntity.fromPersistence({
      id: version.id,
      name: version.name,
      hash: version.hash,
      size: version.size,
      fileId: version.fileId,
      isLast: version.isLast,
      createdAt: version.createdAt,
      updatedAt: version.updatedAt,
      deletedAt: version.deletedAt,
    });
  }

  async findByFileId(fileId: number): Promise<FileVersionEntity[]> {
    const versions = await this.prisma.client.fileVersion.findMany({
      where: {
        fileId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return versions.map((version) =>
      FileVersionEntity.fromPersistence({
        id: version.id,
        name: version.name,
        hash: version.hash,
        size: version.size,
        fileId: version.fileId,
        isLast: version.isLast,
        createdAt: version.createdAt,
        updatedAt: version.updatedAt,
        deletedAt: version.deletedAt,
      }),
    );
  }

  async findLastVersionByFileId(
    fileId: number,
  ): Promise<FileVersionEntity | null> {
    const version = await this.prisma.client.fileVersion.findFirst({
      where: {
        fileId,
        isLast: true,
        deletedAt: null,
      },
    });

    if (!version) {
      return null;
    }

    return FileVersionEntity.fromPersistence({
      id: version.id,
      name: version.name,
      hash: version.hash,
      size: version.size,
      fileId: version.fileId,
      isLast: version.isLast,
      createdAt: version.createdAt,
      updatedAt: version.updatedAt,
      deletedAt: version.deletedAt,
    });
  }

  async save(version: FileVersionEntity): Promise<FileVersionEntity> {
    const savedVersion = await this.prisma.client.fileVersion.upsert({
      where: { id: version.id },
      create: {
        id: version.id,
        name: version.name,
        hash: version.hash,
        size: version.size,
        fileId: version.fileId,
        isLast: version.isLast,
      },
      update: {
        name: version.name,
        hash: version.hash,
        size: version.size,
        isLast: version.isLast,
        updatedAt: new Date(),
        deletedAt: version.deletedAt,
      },
    });

    return FileVersionEntity.fromPersistence({
      id: savedVersion.id,
      name: savedVersion.name,
      hash: savedVersion.hash,
      size: savedVersion.size,
      fileId: savedVersion.fileId,
      isLast: savedVersion.isLast,
      createdAt: savedVersion.createdAt,
      updatedAt: savedVersion.updatedAt,
      deletedAt: savedVersion.deletedAt,
    });
  }

  async markAllAsNotLast(fileId: number): Promise<void> {
    await this.prisma.client.fileVersion.updateMany({
      where: {
        fileId,
        deletedAt: null,
      },
      data: {
        isLast: false,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.fileVersion.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
