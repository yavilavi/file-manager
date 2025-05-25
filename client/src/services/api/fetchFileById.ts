/**
 * File Manager - Fetchfilebyid
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { FileInterface } from '../../types/interfaces/file.interface.ts';

export const fetchFileById = async (id: number): Promise<FileInterface> => {
  const { data } = await apiCall.get(`/files/${id}`);
  return data;
};
