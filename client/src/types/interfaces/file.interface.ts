import { FileExtension } from '../../utils/get-file-icon.tsx';

export interface FileInterface {
  id: number;
  name: string;
  extension: FileExtension;
  mimeType: string;
  hash: string;
  size: number; // bytes
  path: string;
  createdAt: string; // ISO string (Date.parse() puede convertirlo)
  updatedAt: string;
  deletedAt: string | null;
}
