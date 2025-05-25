/**
 * File Manager - file.repository.interface Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { FileEntity } from '../entities/file.entity';
import { FileVersionEntity } from '../entities/file-version.entity';

export const FILE_REPOSITORY = 'FILE_REPOSITORY';

export interface FileWithRelations {
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
  user: {
    id: number;
    name: string;
    email: string;
    department: {
      id: number;
      name: string;
    } | null;
  } | null;
  company: {
    id: number;
    name: string;
    nit: string;
    tenantId: string;
  } | null;
}

export interface IFileRepository {
  findById(id: number, tenantId: string): Promise<FileEntity | null>;

  findByHash(hash: string, tenantId: string): Promise<FileEntity | null>;

  findAllByTenant(tenantId: string): Promise<FileEntity[]>;

  findAllByTenantWithRelations(tenantId: string): Promise<FileWithRelations[]>;

  findByIdWithVersions(
    id: number,
    tenantId: string,
  ): Promise<FileEntity | null>;

  save(file: FileEntity): Promise<FileEntity>;

  delete(id: number, tenantId: string): Promise<void>;

  updateHash(id: number, newHash: string): Promise<void>;
}

export interface IFileVersionRepository {
  findById(id: string): Promise<FileVersionEntity | null>;

  findByFileId(fileId: number): Promise<FileVersionEntity[]>;

  findLastVersionByFileId(fileId: number): Promise<FileVersionEntity | null>;

  save(version: FileVersionEntity): Promise<FileVersionEntity>;

  markAllAsNotLast(fileId: number): Promise<void>;

  delete(id: string): Promise<void>;
}
