import apiCall from '../axios.ts';

export const assignRoleToUser = async (userId: number, roleId: number): Promise<any> => {
  const { data } = await apiCall.post(`/roles/users/${userId}/roles/${roleId}`);
  return data;
}; 