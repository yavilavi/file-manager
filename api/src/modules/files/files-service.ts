import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { MinioService } from '@libs/storage/minio/minio.service';
import { File } from '@prisma/client';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
    private readonly prisma: PrismaService,
  ) {}

  async getFileById(id: number, tenantId: string) {
    const file = await this.prisma.client.file.findUnique({
      where: {
        id,
        tenantId: tenantId,
        deletedAt: null,
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
    if (!file) {
      throw new NotFoundException('El archivo no existe');
    }
    return file;
  }

  async getAllFiles(tenantId: string) {
    return await this.prisma.client.file.findMany({
      relationLoadStrategy: 'join',
      orderBy: {
        name: 'asc',
      },
      where: {
        deletedAt: null,
        tenantId: tenantId,
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
      const filePath = `tenant_${tenantId}/${hash}`;
      await this.minioService.uploadFile(file, filePath);
      const fileRecord = await this.saveFileRecord(
        file,
        filePath,
        hash,
        tenantId,
        userId,
      );
      return { message: 'UPLOADED', file: fileRecord };
    }
  }

  async checkFileExists(hash: string, tenantId: string): Promise<File | null> {
    return await this.prisma.client.file.findUnique({
      where: {
        hash,
        tenantId: tenantId,
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

  async saveFileRecord(
    file: Express.Multer.File,
    path: string,
    hash: string,
    tenantId: string,
    userId: number,
  ): Promise<File> {
    return await this.prisma.client.file.create({
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

  async downloadFile(id: number, tenantId: string) {
    const file = await this.prisma.client.file.findUnique({
      where: {
        id,
        tenantId: tenantId,
        deletedAt: null,
      },
    });
    if (!file) {
      throw new NotFoundException('El archivo no existe');
    }
    const stream = await this.minioService.downloadFile(file.path);

    return {
      stream,
      contentType: file.mimeType,
      fileName: file.name,
    };
  }

  async deleteFile(id: number, tenantId: string) {
    const file = await this.prisma.client.file.findUnique({
      where: {
        id,
        tenantId: tenantId,
        deletedAt: null,
      },
    });
    if (!file) {
      throw new NotFoundException('El archivo no existe');
    }
    await this.prisma.client.file.update({
      where: {
        id: file.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
