/**
 * File Manager - Updaterole
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { RoleInterface, UpdateRoleDto } from '../../types/interfaces/role-interface.ts';

export const updateRole = async (
  id: number, 
  roleData: UpdateRoleDto
): Promise<RoleInterface> => {
  const { data } = await apiCall.patch<RoleInterface>(`/roles/${id}`, roleData);
  return data;
}; 