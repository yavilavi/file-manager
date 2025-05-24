import apiCall from '../axios.ts';
import { RoleInterface } from '../../types/interfaces/role-interface.ts';

export const getUserRoles = async (userId: number): Promise<RoleInterface[]> => {
  const { data } = await apiCall.get<RoleInterface[]>(`/roles/users/${userId}/roles`);
  return data;
}; 