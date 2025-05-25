/**
 * File Manager - Assignroletouser
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';

export const assignRoleToUser = async (userId: number, roleId: number): Promise<any> => {
  const { data } = await apiCall.post(`/roles/users/${userId}/roles/${roleId}`);
  return data;
}; 