/**
 * File Manager - Upload File.Use Case
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { FileEntity } from '../../domain/entities/file.entity';
import { FileMetadata } from '../../domain/value-objects/file-metadata.vo';
import { TenantId } from '../../domain/value-objects/tenant-id.vo';
import {
  FILE_REPOSITORY,
  IFileRepository,
} from '../../domain/repositories/file.repository.interface';
import {
  FILE_STORAGE_SERVICE,
  IFileStorageService,
} from '../../domain/services/file-storage.service.interface';
import {
  UploadFileDto,
  FileUploadResultDto,
  FileResponseDto,
} from '../dtos/upload-file.dto';
import getDocumentTypeByExtension from '../../../../utils/document-type.util';

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly storageService: IFileStorageService,
  ) {}

  async execute(uploadDto: UploadFileDto): Promise<FileUploadResultDto> {
    // Create value objects
    const tenantId = TenantId.create(uploadDto.tenantId);
    const extension = this.extractExtension(uploadDto.originalname);
    const metadata = FileMetadata.create({
      name: uploadDto.originalname,
      extension,
      mimeType: uploadDto.mimetype,
      size: uploadDto.size,
    });

    // Generate file hash
    const hash = createHash('sha256').update(uploadDto.buffer).digest('hex');

    // Check if file already exists
    const existingFile = await this.fileRepository.findByHash(
      hash,
      tenantId.value,
    );
    if (existingFile) {
      return new FileUploadResultDto(
        'EXISTING',
        this.mapToResponseDto(existingFile),
      );
    }

    // Upload file to storage
    const filePath = `tenant_${tenantId.value}/${metadata.name}`;
    const { versionId } = await this.storageService.uploadFile(
      uploadDto.buffer,
      filePath,
      metadata.mimeType,
    );

    // Create file entity
    const fileEntity = FileEntity.create({
      name: metadata.name,
      extension: metadata.extension,
      mimeType: metadata.mimeType,
      hash,
      size: metadata.size,
      path: filePath,
      documentType: getDocumentTypeByExtension(metadata.extension),
      tenantId: tenantId.value,
      userId: uploadDto.userId,
    });

    // Save file to repository
    const savedFile = await this.fileRepository.save(fileEntity);

    // Create file version if versionId is provided
    if (versionId && savedFile.id) {
      // Note: FileVersion saving would be handled by the repository implementation
      // This is where version creation logic would go when implemented
    }

    return new FileUploadResultDto(
      'UPLOADED',
      this.mapToResponseDto(savedFile),
    );
  }

  private extractExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()! : 'NA';
  }

  private mapToResponseDto(file: FileEntity): FileResponseDto {
    return new FileResponseDto({
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
}
