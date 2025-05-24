import { FileEntity } from '../entities/file.entity';
import { FileVersionEntity } from '../entities/file-version.entity';

export const FILE_REPOSITORY = 'FILE_REPOSITORY';

export interface IFileRepository {
  findById(id: number, tenantId: string): Promise<FileEntity | null>;

  findByHash(hash: string, tenantId: string): Promise<FileEntity | null>;

  findAllByTenant(tenantId: string): Promise<FileEntity[]>;

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
