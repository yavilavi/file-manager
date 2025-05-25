/**
 * File Manager - Removerolefromuser
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';

export const removeRoleFromUser = async (userId: number, roleId: number): Promise<any> => {
  const { data } = await apiCall.delete(`/roles/users/${userId}/roles/${roleId}`);
  return data;
}; 