import { Inject, Injectable } from '@nestjs/common';
import { TenantId } from '../../domain/value-objects/tenant-id.vo';
import {
  FILE_REPOSITORY,
  IFileRepository,
} from '../../domain/repositories/file.repository.interface';
import { FileResponseDto } from '../dtos/upload-file.dto';

@Injectable()
export class GetAllFilesUseCase {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(tenantId: string): Promise<FileResponseDto[]> {
    // Validate tenant ID
    const validatedTenantId = TenantId.create(tenantId);

    // Get all files for the tenant
    const files = await this.fileRepository.findAllByTenant(
      validatedTenantId.value,
    );

    // Map to response DTOs
    return files.map(
      (file) =>
        new FileResponseDto({
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
        }),
    );
  }
}
