import apiCall from '../axios.ts';
import { RoleInterface } from '../../types/interfaces/role-interface.ts';

export const fetchRoles = async (): Promise<RoleInterface[]> => {
  const { data } = await apiCall.get<RoleInterface[]>('/roles');
  return data;
}; 