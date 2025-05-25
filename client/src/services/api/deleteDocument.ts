/**
 * File Manager - Deletedocument
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';

export const deleteDocument = async (id: number) => {
  const { data } = await apiCall.delete(`/files/${id}`);
  return data;
};