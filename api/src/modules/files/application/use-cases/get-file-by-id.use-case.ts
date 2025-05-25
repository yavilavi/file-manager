/**
 * File Manager - Get File By Id.Use Case
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
import { FileResponseDto } from '../dtos/upload-file.dto';

@Injectable()
export class GetFileByIdUseCase {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(id: number, tenantId: string): Promise<FileResponseDto> {
    // Validate tenant ID
    const validatedTenantId = TenantId.create(tenantId);

    // Find file by ID and tenant
    const file = await this.fileRepository.findById(
      id,
      validatedTenantId.value,
    );
    if (!file || file.isDeleted()) {
      throw new NotFoundException('El archivo no existe');
    }

    // Verify file belongs to the tenant
    if (!file.belongsToTenant(validatedTenantId.value)) {
      throw new NotFoundException('El archivo no existe');
    }

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
