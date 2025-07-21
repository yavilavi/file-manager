/**
 * File Manager - Save Edited File Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import * as Stream from 'node:stream';
import axios from 'axios';
import { TenantId } from '../../domain/value-objects/tenant-id.vo';
import {
  FILE_REPOSITORY,
  IFileRepository,
} from '../../domain/repositories/file.repository.interface';
import { FileVersionRepository } from '../../infrastructure/repositories/file-version.repository';
import {
  FILE_STORAGE_SERVICE,
  IFileStorageService,
} from '../../domain/services/file-storage.service.interface';
import { FileVersionEntity } from '../../domain/entities/file-version.entity';
import {
  SaveEditedFileDto,
  SaveEditedFileResponseDto,
} from '../dtos/save-edited-file.dto';

@Injectable()
export class SaveEditedFileUseCase {
  private readonly logger = new Logger(SaveEditedFileUseCase.name);

  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
    private readonly fileVersionRepository: FileVersionRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
  ) {}

  async execute(dto: SaveEditedFileDto): Promise<SaveEditedFileResponseDto> {
    try {
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

      // Download the edited file from the provided URL
      const response = await axios.get<Stream.Readable>(dto.downloadUrl, {
        responseType: 'stream',
      });

      // Create a hash object to calculate the new file hash
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
        }, 300000); // 5 minutes timeout

        transformStream.on('end', () => {
          clearTimeout(timeout);
          // Get the hash after the stream is fully processed
          const hash = hashObj.digest('hex');
          resolve(hash);
        });

        transformStream.on('error', (err) => {
          clearTimeout(timeout);
          this.logger.error(`Error processing stream: ${err.message}`);
          reject(err);
        });
      });

      // Save the edited file to storage
      const { versionId } = await this.fileStorageService.saveEditedFile(
        file.path,
        transformStream,
        file.size,
        file.mimeType,
      );

      // Wait for the stream to finish and get the hash
      const newHash = await streamFinished;

      // Create a file version before updating the file (if we have a versionId)
      if (versionId) {
        await this.createFileVersion(
          file.id,
          file.name,
          file.hash,
          file.size,
          versionId,
        );
      }

      // Update the file record with the new hash
      await this.fileRepository.updateHash(file.id, newHash);

      this.logger.log(`Archivo ${dto.fileId} actualizado en storage`);

      return new SaveEditedFileResponseDto({
        success: true,
        message: 'Archivo actualizado exitosamente',
        versionId: versionId || undefined,
      });
    } catch (error) {
      this.logger.error(
        `Error saving edited file ${dto.fileId}: ${(error as Error).message}`,
      );

      return new SaveEditedFileResponseDto({
        success: false,
        message: `Error actualizando archivo: ${(error as Error).message}`,
      });
    }
  }

  /**
   * Creates a version of the file before it's updated
   */
  private async createFileVersion(
    fileId: number,
    fileName: string,
    fileHash: string,
    fileSize: number,
    versionId: string,
  ): Promise<void> {
    try {
      // Mark all existing versions as not last
      await this.fileVersionRepository.markAllAsNotLast(fileId);

      // Create the new version entity
      const versionEntity = FileVersionEntity.create({
        id: versionId,
        name: fileName,
        hash: fileHash,
        size: fileSize,
        fileId,
        isLast: true,
      });

      // Save the new version
      await this.fileVersionRepository.save(versionEntity);

      this.logger.log(`Version ${versionId} created for file ${fileId}`);
    } catch (error) {
      this.logger.error(
        `Error creating file version: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}