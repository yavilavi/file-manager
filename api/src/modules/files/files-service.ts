import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { MinioService } from '@libs/storage/minio/minio.service';
import { File } from '@prisma/client';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as Stream from 'node:stream';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateEditorConfig(
    fileId: number,
    userId: number,
    userDepartmentName: string,
    userName: string,
    tenantId: string,
    token: string,
  ) {
    const file = await this.getFileById(fileId, tenantId);
    const protocol = this.configService.getOrThrow<string>('protocol');
    const internalBeUrl = this.configService.getOrThrow<string>(
      'onlyoffice.internalBeUrl',
    );
    const url = `${protocol}://${internalBeUrl}/files/get-edit-url/${fileId}?token=${token}&tenantId=${tenantId}`;
    const config = {
      key: `${tenantId}${file.id}`,
      document: {
        key: `${tenantId}_${file.id}`,
        fileType: file.extension,
        title: file.name,
        url: url,
        permissions: {
          edit: true,
        },
      },
      documentType: 'cell',
      editorConfig: {
        callbackUrl: `${protocol}://${internalBeUrl}/files/changes-callback/${fileId}?tenantId=${tenantId}&token=${token}`,
        user: {
          id: `${userId}`,
          name: userName,
        },
      },
    };

    const jwtToken = this.jwtService.sign(config);
    const editorUrl = `${this.configService.getOrThrow<string>('onlyoffice.url')}/web-apps/apps/spreadsheeteditor/embed/index.html?lang=es&token=${jwtToken}`;

    return { editorUrl, token, config: { ...config, token: jwtToken } };
  }

  async getPresignedUrl(fileId: number, tenantId: string) {
    const file = await this.prisma.client.file.findUnique({
      where: {
        id: fileId,
        tenantId: tenantId,
        deletedAt: null,
      },
    });
    if (!file) {
      throw new NotFoundException('El archivo no existe');
    }
    return await this.minioService.getPresignedUrl(file.path);
  }

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
      const filePath = `tenant_${tenantId}/${file.originalname}`;
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
    return await this.prisma.client.file.findFirst({
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

  async saveEditedFile(
    fileId: number,
    downloadUrl: string,
    tenantId: string,
  ): Promise<void> {
    const file = await this.getFileById(Number(fileId), tenantId);
    const response = await axios.get<Stream.Readable>(downloadUrl, {
      responseType: 'stream',
    });
    await this.minioService.saveEditedFile(
      file.path,
      response.data,
      file.size,
      file.mimeType,
    );
    console.log(`Archivo ${fileId} actualizado en Minio`);
  }
}
