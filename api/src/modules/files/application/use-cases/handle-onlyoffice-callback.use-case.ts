/**
 * File Manager - Handle OnlyOffice Callback Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SaveEditedFileUseCase } from './save-edited-file.use-case';
import { SaveEditedFileDto } from '../dtos/save-edited-file.dto';
import {
  OnlyOfficeCallbackDto,
  OnlyOfficeCallbackResponseDto,
  OnlyOfficeCallbackStatus,
} from '../dtos/onlyoffice-callback.dto';

@Injectable()
export class HandleOnlyOfficeCallbackUseCase {
  private readonly logger = new Logger(HandleOnlyOfficeCallbackUseCase.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly saveEditedFileUseCase: SaveEditedFileUseCase,
  ) {}

  async execute(
    fileId: number,
    token: string,
    tenantId: string,
    callbackData: OnlyOfficeCallbackDto,
  ): Promise<OnlyOfficeCallbackResponseDto> {
    try {
      // Verify JWT token
      this.jwtService.verify(token);

      // Validate the callback key matches the expected format
      const expectedKey = `${tenantId}_${fileId}`;
      if (callbackData.key !== expectedKey) {
        this.logger.error(
          `Invalid callback key for file ${fileId}. Expected: ${expectedKey}, Received: ${callbackData.key}`,
        );
        return new OnlyOfficeCallbackResponseDto(1);
      }

      this.logger.debug(callbackData, 'Changes callback body');

      // Handle different callback statuses
      switch (callbackData.status as OnlyOfficeCallbackStatus) {
        case OnlyOfficeCallbackStatus.BEING_EDITED:
          this.logger.log(
            `Document ${fileId} is being edited by users: ${callbackData.users ?? 'unknown'}`,
          );
          // No action needed, document is just being edited
          break;

        case OnlyOfficeCallbackStatus.READY_FOR_SAVING:
          this.logger.log(`Document ${fileId} is ready for saving`);
          // Document is ready but not yet saved, no action needed
          break;

        case OnlyOfficeCallbackStatus.SAVE_ERROR:
          this.logger.error(`Error saving document ${fileId}`);
          if (callbackData.url) {
            await this.saveEditedFile(fileId, callbackData.url, tenantId);
          } else {
            this.logger.error(`Missing download URL for file ${fileId}`);
          }
          break;

        case OnlyOfficeCallbackStatus.CLOSED_NO_CHANGES:
          this.logger.log(`Document ${fileId} was closed with no changes`);
          // No action needed as no changes were made
          break;

        case OnlyOfficeCallbackStatus.SAVED_WHILE_EDITING:
          this.logger.log(`Document ${fileId} state was saved`);
          // Document state was saved but editing continues, no action needed
          break;

        case OnlyOfficeCallbackStatus.SAVED_BY_TIMEOUT:
          this.logger.log(`Document ${fileId} was saved by timeout`);
          if (callbackData.url) {
            await this.saveEditedFile(fileId, callbackData.url, tenantId);
          } else {
            this.logger.error(`Missing download URL for file ${fileId}`);
          }
          break;

        case OnlyOfficeCallbackStatus.EDITING_ERROR:
          this.logger.error(`Error editing document ${fileId}`);
          // Return error as this is a critical error that prevents saving
          return new OnlyOfficeCallbackResponseDto(1);

        default:
          this.logger.warn(
            `Unknown callback status ${callbackData.status} for document ${fileId}`,
          );
        // For unknown statuses, we don't take any action but log a warning
      }

      return new OnlyOfficeCallbackResponseDto(0);
    } catch (error) {
      this.logger.error(
        `Error handling OnlyOffice callback for file ${fileId}: ${(error as Error).message}`,
      );
      return new OnlyOfficeCallbackResponseDto(1);
    }
  }

  private async saveEditedFile(
    fileId: number,
    downloadUrl: string,
    tenantId: string,
  ): Promise<void> {
    try {
      const dto = new SaveEditedFileDto({
        fileId,
        downloadUrl,
        tenantId,
      });

      const result = await this.saveEditedFileUseCase.execute(dto);

      if (!result.success) {
        this.logger.error(
          `Failed to save edited file ${fileId}: ${result.message}`,
        );
      } else {
        this.logger.log(
          `Successfully saved edited file ${fileId}${result.versionId ? ` with version ${result.versionId}` : ''}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error calling save edited file use case for file ${fileId}: ${(error as Error).message}`,
      );
    }
  }
}
