import { Permission } from '../../permissions/interfaces/permission.interface';

export interface Role {
  id: number;
  name: string;
  description: string | null;
  isAdmin: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  permissions?: Permission[];
}

export interface UserRole {
  userId: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}
