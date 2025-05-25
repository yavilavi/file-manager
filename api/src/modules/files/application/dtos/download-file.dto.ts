/**
 * File Manager - download-file.dto DTO
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Readable } from 'stream';

export class DownloadFileDto {
  readonly id: number;
  readonly tenantId: string;
  readonly versionId?: string;

  constructor(props: { id: number; tenantId: string; versionId?: string }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.versionId = props.versionId;
  }
}

export class FileDownloadResultDto {
  readonly stream: Readable;
  readonly contentType: string;
  readonly fileName: string;

  constructor(props: {
    stream: Readable;
    contentType: string;
    fileName: string;
  }) {
    this.stream = props.stream;
    this.contentType = props.contentType;
    this.fileName = props.fileName;
  }
}
