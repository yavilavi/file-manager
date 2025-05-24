import apiCall from '../axios.ts';
import { CreateRoleDto, RoleInterface } from '../../types/interfaces/role-interface.ts';

export const createRole = async (roleData: CreateRoleDto): Promise<RoleInterface> => {
  const { data } = await apiCall.post<RoleInterface>('/roles', roleData);
  return data;
}; 