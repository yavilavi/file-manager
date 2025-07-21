/**
 * File Manager - Save Edited File DTOs
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

export class SaveEditedFileDto {
  fileId: number;
  downloadUrl: string;
  tenantId: string;

  constructor(params: {
    fileId: number;
    downloadUrl: string;
    tenantId: string;
  }) {
    this.fileId = params.fileId;
    this.downloadUrl = params.downloadUrl;
    this.tenantId = params.tenantId;
  }
}

export class SaveEditedFileResponseDto {
  success: boolean;
  message: string;
  versionId?: string;

  constructor(params: {
    success: boolean;
    message: string;
    versionId?: string;
  }) {
    this.success = params.success;
    this.message = params.message;
    this.versionId = params.versionId;
  }
}