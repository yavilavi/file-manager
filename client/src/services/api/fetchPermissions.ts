/**
 * File Manager - Fetchpermissions
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { PermissionInterface } from '../../types/interfaces/role-interface.ts';

export const fetchPermissions = async (): Promise<PermissionInterface[]> => {
  const { data } = await apiCall.get<PermissionInterface[]>('/permissions');
  return data;
}; 