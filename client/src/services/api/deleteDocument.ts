import apiCall from '../axios.ts';

export const deleteDocument = async (id: number) => {
  const { data } = await apiCall.delete(`/files/${id}`);
  return data;
};