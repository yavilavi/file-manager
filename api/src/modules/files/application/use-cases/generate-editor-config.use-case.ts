/**
 * File Manager - Generate Editor Config Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TenantId } from '../../domain/value-objects/tenant-id.vo';
import {
  FILE_REPOSITORY,
  IFileRepository,
} from '../../domain/repositories/file.repository.interface';
import { FileVersionRepository } from '../../infrastructure/repositories/file-version.repository';
import {
  GenerateEditorConfigDto,
  GenerateEditorConfigResponseDto,
  OnlyOfficeConfig,
} from '../dtos/generate-editor-config.dto';
import getDocumentTypeByExtension from '../../../../utils/document-type.util';

@Injectable()
export class GenerateEditorConfigUseCase {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
    private readonly fileVersionRepository: FileVersionRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    dto: GenerateEditorConfigDto,
  ): Promise<GenerateEditorConfigResponseDto> {
    // Validate tenant ID
    const validatedTenantId = TenantId.create(dto.tenantId);

    // Get file by ID and validate it exists and belongs to tenant
    const file = await this.fileRepository.findById(
      dto.fileId,
      validatedTenantId.value,
    );
    if (!file || file.isDeleted()) {
      throw new Error('El archivo no existe');
    }

    if (!file.belongsToTenant(validatedTenantId.value)) {
      throw new Error('El archivo no existe');
    }

    // Get OnlyOffice internal backend URL from configuration
    const internalBeUrl = this.configService.getOrThrow<string>(
      'onlyoffice.internalBeUrl',
    );

    // Get the last version of the file
    const lastVersion =
      await this.fileVersionRepository.findLastVersionByFileId(file.id);

    // Build the file access URL
    const versionParam = lastVersion ? `&versionId=${lastVersion.id}` : '';
    const url = `http://${internalBeUrl}/files/get-edit-url/${dto.fileId}?token=${dto.token}&tenantId=${dto.tenantId}${versionParam}`;

    // Build OnlyOffice configuration
    const config: OnlyOfficeConfig = {
      key: `${dto.tenantId}${file.id}`,
      document: {
        key: `${dto.tenantId}_${file.id}`,
        fileType: file.extension,
        title: file.name,
        url: url,
        permissions: {
          edit: true,
        },
      },
      documentType: getDocumentTypeByExtension(file.extension),
      editorConfig: {
        callbackUrl: `http://${internalBeUrl}/files/changes-callback/${dto.fileId}?tenantId=${dto.tenantId}&token=${dto.token}`,
        user: {
          id: `${dto.userId}`,
          name: `${dto.userName} (${dto.userDepartmentName})`,
        },
      },
    };

    // Sign the configuration with JWT
    const jwtToken = this.jwtService.sign(config, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
    });
    const configWithToken = { ...config, token: jwtToken };

    return new GenerateEditorConfigResponseDto({
      token: dto.token,
      config: configWithToken,
    });
  }
} 