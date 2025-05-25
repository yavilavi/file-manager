/**
 * File Manager - Files Service.Old
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { MinioService } from '@libs/storage/minio/minio.service';
import { File, Prisma } from '@prisma/client';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as Stream from 'node:stream';
import getDocumentTypeByExtension from '../../utils/document-type.util';

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
    const internalBeUrl = this.configService.getOrThrow<string>(
      'onlyoffice.internalBeUrl',
    );

    // Get the last version of the file
    const lastVersion = await this.prisma.client.fileVersion.findFirst({
      where: {
        fileId: file.id,
        isLast: true,
        deletedAt: null,
      },
    });

    const url = `http://${internalBeUrl}/files/get-edit-url/${fileId}?token=${token}&tenantId=${tenantId}${lastVersion ? `&versionId=${lastVersion.id}` : ''}`;
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
      documentType: getDocumentTypeByExtension(file.extension),
      editorConfig: {
        callbackUrl: `http://${internalBeUrl}/files/changes-callback/${fileId}?tenantId=${tenantId}&token=${token}`,
        user: {
          id: `${userId}`,
          name: `${userName} (${userDepartmentName})`,
        },
      },
    };

    const jwtToken = this.jwtService.sign(config);

    return { token, config: { ...config, token: jwtToken } };
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
    return this.prisma.client.file.findMany({
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
      const { versionId } = await this.minioService.uploadFile(file, filePath);
      const fileRecord = await this.saveFileRecord(
        file,
        filePath,
        hash,
        tenantId,
        userId,
        versionId,
      );
      return { message: 'UPLOADED', file: fileRecord };
    }
  }

  async checkFileExists(hash: string, tenantId: string): Promise<File | null> {
    return this.prisma.client.file.findFirst({
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
    versionId: string | null,
  ): Promise<File> {
    const name = file.originalname.replace(/[_-]/g, ' ');
    const extension = name.split('.').pop() ?? 'NA';
    const createdFile = await this.prisma.client.file.create({
      data: {
        name,
        extension,
        hash,
        size: file.size,
        path,
        mimeType: file.mimetype,
        documentType: getDocumentTypeByExtension(extension),
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
    if (versionId) {
      await this.prisma.client.fileVersion.create({
        data: {
          id: versionId,
          name,
          hash,
          size: file.size,
          fileId: createdFile.id,
        },
      });
    }
    return createdFile;
  }

  async downloadFile(
    id: number,
    tenantId: string,
    versionId: string | undefined,
  ) {
    const whereClause: Prisma.FileWhereUniqueInput = {
      id,
      tenantId: tenantId,
      deletedAt: null,
    };

    if (versionId !== undefined) {
      whereClause.versions = {
        some: {
          id: versionId,
        },
      };
    }

    const file = await this.prisma.client.file.findUnique({
      where: whereClause,
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
    try {
      const file = await this.getFileById(Number(fileId), tenantId);
      const response = await axios.get<Stream.Readable>(downloadUrl, {
        responseType: 'stream',
      });

      // Create a hash object
      const hashObj = createHash('sha256');

      // Create a transform stream that updates the hash
      const transformStream = new Stream.Transform({
        transform(
          chunk: Buffer,
          encoding: BufferEncoding,
          callback: (error?: Error | null) => void,
        ) {
          hashObj.update(chunk);
          this.push(chunk);
          callback();
        },
      });

      // Pipe the response data through the transform stream
      response.data.pipe(transformStream);

      // Create a promise that resolves when the stream is finished
      const streamFinished = new Promise<string>((resolve, reject) => {
        // Add a timeout to handle cases where the stream might not emit an 'end' event
        const timeout = setTimeout(() => {
          reject(new Error('Stream processing timed out'));
        }, 300000);

        transformStream.on('end', () => {
          clearTimeout(timeout);
          // Get the hash after the stream is fully processed
          const hash = hashObj.digest('hex');
          resolve(hash);
        });

        transformStream.on('error', (err) => {
          clearTimeout(timeout);
          Logger.error(`Error processing stream: ${err.message}`);
          reject(err);
        });
      });

      // Save the file to Minio
      const { versionId } = await this.minioService.saveEditedFile(
        file.path,
        transformStream,
        file.size,
        file.mimeType,
      );

      // Wait for the stream to finish and get the hash
      const hash = await streamFinished;

      // Create a file version before updating the file
      if (versionId) await this.createFileVersion(file, versionId);

      // Update the file record with the new hash
      await this.prisma.client.file.update({
        where: {
          id: file.id,
        },
        data: {
          hash,
        },
      });

      Logger.log(`Archivo ${fileId} actualizado en Minio`);
    } catch (error) {
      Logger.error(
        `Error saving edited file ${fileId}: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  /**
   * Creates a version of the file before it's updated
   */
  private async createFileVersion(
    file: File,
    versionId: string,
  ): Promise<void> {
    await this.prisma.client.$transaction([
      this.prisma.client.fileVersion.updateMany({
        where: {
          file: {
            id: file.id,
          },
        },
        data: {
          isLast: false,
        },
      }),
      this.prisma.client.fileVersion.create({
        data: {
          id: versionId,
          name: file.name,
          hash: file.hash,
          size: file.size,
          fileId: file.id,
        },
      }),
    ]);

    Logger.log(`Version ${versionId} created for file ${file.id}`);
  }

  /**
   * Gets all versions of a file
   */
  async getFileVersions(fileId: number, tenantId: string) {
    const file = await this.getFileById(fileId, tenantId);

    return this.prisma.client.fileVersion.findMany({
      where: {
        fileId: file.id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
