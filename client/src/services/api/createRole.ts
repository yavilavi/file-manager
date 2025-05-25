/**
 * File Manager - Createrole
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { CreateRoleDto, RoleInterface } from '../../types/interfaces/role-interface.ts';

export const createRole = async (roleData: CreateRoleDto): Promise<RoleInterface> => {
  const { data } = await apiCall.post<RoleInterface>('/roles', roleData);
  return data;
}; 