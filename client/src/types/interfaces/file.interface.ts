import { FileExtension } from '../../utils/get-file-icon.tsx';

export interface FileInterface {
  id: number;
  name: string;
  extension: FileExtension;
  mimeType: string;
  hash: string;
  size: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    department?: {
      id: number;
      name: string;
    };
  };
  company: {
    id: number;
    name: string;
    nit: string;
    tenantId: string;
  };
}
