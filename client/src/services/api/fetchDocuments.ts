import apiCall from '../axios.ts';
import { FileInterface } from '../../types/interfaces/file.interface.ts';

export const fetchDocuments = async () => {
  const { data } = await apiCall.get<FileInterface[]>('/files');
  return data;
};
