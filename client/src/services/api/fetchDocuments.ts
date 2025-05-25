/**
 * File Manager - Fetchdocuments
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { FileInterface } from '../../types/interfaces/file.interface.ts';

export const fetchDocuments = async () => {
  const { data } = await apiCall.get<FileInterface[]>('/files');
  return data;
};
