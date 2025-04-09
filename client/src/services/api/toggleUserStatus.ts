import apiCall from '../axios.ts';

export const toggleUserStatus = async (userId: number) => {
  const { data } = await apiCall.patch(`/users/${userId}/toggle-status`);
  return data;
};
