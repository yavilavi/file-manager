/**
 * File Manager - Role Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export interface PermissionInterface {
  id: string; // Format: <resource>:<action> example: file:delete
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleInterface {
  id: number;
  name: string;
  description: string | null;
  isAdmin: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  permissions: PermissionInterface[];
  userCount?: number;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds?: string[];
  isAdmin?: boolean;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: string[];
  isAdmin?: boolean;
}

export interface UserRoleDto {
  userId: number;
  roleId: number;
} 