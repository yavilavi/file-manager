/**
 * File Manager - Request User Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

import { User, Department } from '@prisma/client';

export interface RequestUserInterface {
  data: Omit<User, 'password' | 'deletedAt'> & {
    tenantId: string;
    departmentId: number | null;
    canSendEmail: boolean;
  };
  department: Pick<Department, 'name' | 'id'> | null;
}
