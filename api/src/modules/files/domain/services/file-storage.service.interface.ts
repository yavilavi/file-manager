import { Readable } from 'stream';

export const FILE_STORAGE_SERVICE = 'FILE_STORAGE_SERVICE';

export interface IFileStorageService {
  uploadFile(
    file: Buffer,
    path: string,
    mimeType: string,
  ): Promise<{ versionId: string | null }>;

  downloadFile(path: string): Promise<Readable>;

  saveEditedFile(
    path: string,
    stream: Readable,
    size: number,
    mimeType: string,
  ): Promise<{ versionId: string | null }>;

  deleteFile(path: string): Promise<void>;
}
