import apiCall from '../axios.ts';
import { PermissionInterface } from '../../types/interfaces/role-interface.ts';

export const fetchPermissions = async (): Promise<PermissionInterface[]> => {
  const { data } = await apiCall.get<PermissionInterface[]>('/permissions');
  return data;
}; 