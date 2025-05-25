/**
 * File Manager - Download File.Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  DownloadFileDto,
  FileDownloadResultDto,
} from '../dtos/download-file.dto';

@Injectable()
export class DownloadFileUseCase {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly storageService: IFileStorageService,
  ) {}

  async execute(downloadDto: DownloadFileDto): Promise<FileDownloadResultDto> {
    // Validate tenant ID
    const tenantId = TenantId.create(downloadDto.tenantId);

    // Find file by ID and tenant
    const file = await this.fileRepository.findById(
      downloadDto.id,
      tenantId.value,
    );
    if (!file || file.isDeleted()) {
      throw new NotFoundException('El archivo no existe');
    }

    // Verify file belongs to the tenant
    if (!file.belongsToTenant(tenantId.value)) {
      throw new NotFoundException('El archivo no existe');
    }

    // Get file stream from storage
    const stream = await this.storageService.downloadFile(file.path);

    return new FileDownloadResultDto({
      stream,
      contentType: file.mimeType,
      fileName: file.name,
    });
  }
}
