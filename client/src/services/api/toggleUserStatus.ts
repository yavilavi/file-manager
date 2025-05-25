/**
 * File Manager - Toggleuserstatus
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';

export const toggleUserStatus = async (userId: number) => {
  const { data } = await apiCall.patch(`/users/${userId}/toggle-status`);
  return data;
};
