import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { MinioService } from '@libs/storage/minio/minio.service';
import prismaClient from '@libs/database/prisma/client/prisma.client';
import { File } from '@prisma/client';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
    private readonly prisma: PrismaService,
  ) {}

  async getAllFiles(tenantId: string) {
    return await this.prisma.client.file.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        deletedAt: null,
        tenantId: tenantId,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    tenantId: string,
    userId: number,
  ) {
    const hash = createHash('sha256').update(file.buffer).digest('hex');
    const dbFile = await this.checkFileExists(hash, tenantId);
    if (dbFile) {
      return { message: 'EXISTING', file: dbFile };
    } else {
      const path = `examen-final/${hash}`;
      await this.minioService.uploadFile(file, path);
      const fileRecord = await this.saveFileRecord(
        file,
        path,
        hash,
        tenantId,
        userId,
      );
      return { message: 'UPLOADED', file: fileRecord };
    }
  }

  async checkFileExists(hash: string, tenantId: string): Promise<File | null> {
    return await prismaClient.file.findUnique({
      where: {
        hash,
        tenantId: tenantId,
      },
    });
  }

  async saveFileRecord(
    file: Express.Multer.File,
    path: string,
    hash: string,
    tenantId: string,
    userId: number,
  ): Promise<File> {
    return await prismaClient.file.create({
      data: {
        name: file.originalname.replace(/[_-]/g, ' '),
        extension: file.originalname.split('.').pop(),
        hash,
        size: file.size,
        path,
        mimeType: file.mimetype,
        tenantId: tenantId,
        userId,
      },
    });
  }
}
