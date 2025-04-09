import apiCall from '../axios.ts';
import { FileInterface } from '../../types/interfaces/file.interface.ts';

export const fetchFileById = async (id: number): Promise<FileInterface> => {
  const { data } = await apiCall.get(`/files/${id}`);
  return data;
};
