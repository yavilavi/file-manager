import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { MinioService } from '@libs/storage/minio/minio.service';
import prisma from '@libs/database/prisma/client/prisma.client';
import formatFileSize from '@utils/format-file-size.util';
import { files } from '@prisma/client';

@Injectable()
export class FilesService {
  constructor(private readonly minioService: MinioService) {}

  async uploadFile(file: Express.Multer.File) {
    const hash = createHash('sha256').update(file.buffer).digest('hex');
    const dbFile = await this.checkFileExists(hash);
    if (dbFile) {
      return { message: 'EXISTING', file: dbFile };
    } else {
      const path = `examen-final/${hash}`;
      await this.minioService.uploadFile(file, path);
      const fileRecord = await this.saveFileRecord(file, path, hash);
      return { message: 'UPLOADED', file: fileRecord };
    }
  }

  async checkFileExists(hash: string): Promise<files | null> {
    return await prisma.files.findUnique({
      where: {
        hash,
      },
    });
  }

  async saveFileRecord(file: Express.Multer.File, path: string, hash: string) {
    return await prisma.files.create({
      data: {
        name: file.originalname,
        extension: file.originalname.split('.').pop(),
        hash,
        size: formatFileSize(file.size),
        path,
        mimeType: file.mimetype,
      },
    });
  }
}
