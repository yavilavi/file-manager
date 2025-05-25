/**
 * File Manager - Delete File.Use Case
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

@Injectable()
export class DeleteFileUseCase {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(id: number, tenantId: string): Promise<void> {
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

    // Mark file as deleted
    const deletedFile = file.markAsDeleted();
    await this.fileRepository.save(deletedFile);
  }
}
