import apiCall from '../axios.ts';
import { FileInterface } from '../../types/interfaces/file.interface.ts';

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  
  const { data } = await apiCall.post<{
    message: string;
    file: FileInterface;
  }>('/files/upload', formData);
  return data;
};
