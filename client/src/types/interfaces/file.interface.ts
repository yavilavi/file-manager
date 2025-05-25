/**
 * File Manager - file.interface Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
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
