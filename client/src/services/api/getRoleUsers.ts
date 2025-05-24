import apiCall from '../axios.ts';
import { UserInterface } from '../../types/interfaces/user-interface.ts';

export const getRoleUsers = async (roleId: number): Promise<UserInterface[]> => {
  const { data } = await apiCall.get<UserInterface[]>(`/roles/${roleId}/users`);
  return data;
}; 