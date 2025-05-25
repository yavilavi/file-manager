/**
 * File Manager - Minio Storage.Adapter
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { MinioService } from '@libs/storage/minio/minio.service';
import { IFileStorageService } from '../../domain/services/file-storage.service.interface';

@Injectable()
export class MinioStorageAdapter implements IFileStorageService {
  constructor(private readonly minioService: MinioService) {}

  async uploadFile(
    file: Buffer,
    path: string,
    mimeType: string,
  ): Promise<{ versionId: string | null }> {
    // Convert buffer to Express.Multer.File-like object for MinioService
    const multerFile = {
      buffer: file,
      mimetype: mimeType,
      originalname: path.split('/').pop() || 'file',
      size: file.length,
    } as Express.Multer.File;

    return await this.minioService.uploadFile(multerFile, path);
  }

  async downloadFile(path: string): Promise<Readable> {
    return await this.minioService.downloadFile(path);
  }

  async saveEditedFile(
    path: string,
    stream: Readable,
    size: number,
    mimeType: string,
  ): Promise<{ versionId: string | null }> {
    return await this.minioService.saveEditedFile(path, stream, size, mimeType);
  }

  async deleteFile(): Promise<void> {
    // For now, we only mark files as deleted in the database
    // Physical deletion from storage is not implemented
    return Promise.resolve();
  }
}
