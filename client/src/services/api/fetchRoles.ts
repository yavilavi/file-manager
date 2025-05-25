/**
 * File Manager - Fetchroles
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { RoleInterface } from '../../types/interfaces/role-interface.ts';

export const fetchRoles = async (): Promise<RoleInterface[]> => {
  const { data } = await apiCall.get<RoleInterface[]>('/roles');
  return data;
}; 