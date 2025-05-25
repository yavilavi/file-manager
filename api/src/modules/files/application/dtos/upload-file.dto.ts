/**
 * File Manager - upload-file.dto DTO
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export class UploadFileDto {
  readonly originalname: string;
  readonly buffer: Buffer;
  readonly mimetype: string;
  readonly size: number;
  readonly tenantId: string;
  readonly userId: number;

  constructor(props: {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
    size: number;
    tenantId: string;
    userId: number;
  }) {
    this.originalname = props.originalname;
    this.buffer = props.buffer;
    this.mimetype = props.mimetype;
    this.size = props.size;
    this.tenantId = props.tenantId;
    this.userId = props.userId;
  }
}

export class FileUploadResultDto {
  readonly message: 'UPLOADED' | 'EXISTING';
  readonly file: FileResponseDto;

  constructor(message: 'UPLOADED' | 'EXISTING', file: FileResponseDto) {
    this.message = message;
    this.file = file;
  }
}

export class FileResponseDto {
  readonly id: number;
  readonly name: string;
  readonly extension: string;
  readonly mimeType: string;
  readonly hash: string;
  readonly size: number;
  readonly path: string;
  readonly documentType: string | null;
  readonly tenantId: string;
  readonly userId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly user?: {
    id: number;
    name: string;
    email: string;
    department?: {
      id: number;
      name: string;
    };
  };
  readonly company?: {
    id: number;
    name: string;
    nit: string;
    tenantId: string;
  };

  constructor(props: {
    id: number;
    name: string;
    extension: string;
    mimeType: string;
    hash: string;
    size: number;
    path: string;
    documentType: string | null;
    tenantId: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    user?: {
      id: number;
      name: string;
      email: string;
      department?: {
        id: number;
        name: string;
      };
    };
    company?: {
      id: number;
      name: string;
      nit: string;
      tenantId: string;
    };
  }) {
    Object.assign(this, props);
  }
}
