import apiCall from '../axios.ts';

export const removeRoleFromUser = async (userId: number, roleId: number): Promise<any> => {
  const { data } = await apiCall.delete(`/roles/users/${userId}/roles/${roleId}`);
  return data;
}; 