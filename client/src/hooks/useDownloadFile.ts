/**
 * File Manager - Usedownloadfile
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useMutation } from '@tanstack/react-query';
import { downloadFile } from '../services/api/downloadFile.ts';

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: downloadFile,
  });
};
